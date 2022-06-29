import {
  PrismaClient,
  Post,
  User,
  Prisma,
  Follows,
  Report,
} from '@prisma/client';
import {Page} from '../typings/CustomType';
import NotifyController, {NotifyTypes} from './NotifyController';

export default class PostController {
  public static async createPublic(
    client: PrismaClient,
    authorId: string,
    post: Pick<Post, 'content' | 'isAnony' | 'imageLink'>,
  ): Promise<Pick<Post, 'id'>> {
    try {
      const publicPost = await client.post.create({
        data: Object.assign(post, {
          isCommunity: true,
          author: {
            connect: {
              id: authorId,
            },
          },
        }),
        include: {
          author: true,
        },
      });

      if (!post.isAnony)
        client.follows
          .findMany({
            where: {
              following: {
                id: authorId,
              },
            },
          })
          .then((follows: Follows[]) => {
            follows.forEach(follow => {
              NotifyController.createNotify(
                client,
                NotifyTypes.NEW_POST,
                publicPost.id,
                `${publicPost.author.nickname}님이 새 공개 질문을 작성했습니다!`,
                follow.followerId,
              );
            });
          });

      return {
        id: publicPost.id,
      };
    } catch (err) {
      throw err;
    }
  }

  public static async createPrivate(
    client: PrismaClient,
    authorId: string,
    receiverId: string,
    post: Pick<Post, 'content' | 'isAnony' | 'imageLink'>,
  ): Promise<Pick<Post, 'id'>> {
    try {
      const privatePost = await client.post.create({
        data: Object.assign(post, {
          isCommunity: false,
          author: {
            connect: {
              id: authorId,
            },
          },
          reveiver: {
            connect: {
              id: receiverId,
            },
          },
        }),
        include: {
          author: true,
          reveiver: true,
        },
      });

      if (!post.isAnony)
        client.follows
          .findMany({
            where: {
              following: {
                id: authorId,
              },
            },
          })
          .then((follows: Follows[]) => {
            follows.forEach(follow => {
              NotifyController.createNotify(
                client,
                NotifyTypes.NEW_POST,
                privatePost.id,
                `${privatePost.author.nickname}님이 새 개인 질문을 작성했습니다!`,
                follow.followerId,
              );
            });
          });

      await NotifyController.createNotify(
        client,
        NotifyTypes.NEW_POST,
        privatePost.id,
        `${
          post.isAnony
            ? '익명의 한 유저가'
            : privatePost.author.nickname + '님이'
        } 새 개인 질문을 작성했습니다!`,
        receiverId,
      );

      return {
        id: privatePost.id,
      };
    } catch (err) {
      throw err;
    }
  }

  public static update(
    client: PrismaClient['post'],
    postId: string,
    post: Partial<Pick<Post, 'content'>>,
  ): Promise<Partial<Pick<Post, 'content' | 'id'>>> {
    return new Promise<Partial<Pick<Post, 'content' | 'id'>>>(
      (
        resolve: (value: Partial<Pick<Post, 'content' | 'id'>>) => void,
        reject: (reason?: any) => void,
      ) => {
        client
          .findFirst({
            select: {
              id: true,
            },
            where: {
              id: postId,
            },
          })
          .then((_post: Pick<Post, 'id'> | null) => {
            if (_post !== null) {
              const postFields: (keyof typeof post)[] = Object.keys(
                post,
              ) as (keyof typeof post)[];
              const postFieldConditions: Partial<
                Record<keyof typeof post, boolean>
              > = {};

              for (let i = 0; i < postFields['length']; i++) {
                postFieldConditions[postFields[i]] = true;
              }

              client
                .update({
                  select: Object.assign({id: true}, postFieldConditions),
                  where: {
                    id: postId,
                  },
                  data: post,
                })
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error('Invalid post information'));
            }

            return;
          })
          .catch(reject);

        return;
      },
    );
  }

  public static read(
    client: PrismaClient['post'],
    condition: {
      postId?: string;
      page?: Page & {userId?: string; isCommunity: boolean};
    },
  ): Promise<(Post & {author: User}) | (Post & {author: User})[]> {
    return new Promise<(Post & {author: User}) | (Post & {author: User})[]>(
      (
        resolve: (
          value: (Post & {author: User}) | (Post & {author: User})[],
        ) => void,
        reject: (reason?: any) => void,
      ) => {
        if (typeof condition.page === 'object') {
          const _condition: Prisma.PostWhereInput = {
            isCommunity: condition.page.isCommunity,
          };

          if (!condition.page.isCommunity) {
            if (typeof condition.page.userId === 'string') {
              _condition.reveiverId = condition.page.userId;
            } else {
              reject(new Error('Invalid post condition'));

              return;
            }
          } else if (typeof condition.page.userId === 'string') {
            reject(new Error('Invalid post condition'));

            return;
          }

          client
            .count({
              where: _condition,
            })
            .then((postCount: number) => {
              if (postCount > 0) {
                if (
                  // @ts-expect-error typescript's fault
                  condition.page.index <
                    Math.ceil(
                      // @ts-expect-error typescript's fault
                      postCount / condition.page.size,
                    ) &&
                  // @ts-expect-error typescript's fault
                  condition.page.index >= 0
                ) {
                  client
                    .findMany({
                      where: _condition,
                      // @ts-expect-error typescript's fault
                      skip: condition.page.size * condition.page.index,
                      // @ts-expect-error typescript's fault
                      take: condition.page.size,
                      orderBy: {
                        // @ts-expect-error typescript's fault
                        id: condition.page.order === 'desc' ? 'desc' : 'asc',
                      },
                      include: {
                        author: true,
                      },
                    })
                    .then(resolve)
                    .catch(reject);
                } else {
                  reject(new Error('Invalid page information'));
                }
              } else {
                resolve([]);
              }

              return;
            })
            .catch(reject);
        } else if (typeof condition.postId === 'string') {
          client
            .findFirst({
              where: {
                id: condition.postId,
              },
              include: {
                author: true,
              },
            })
            .then((post: (Post & {author: User}) | null) => {
              if (post !== null) {
                resolve(post);
              } else {
                reject(new Error('Invalid post information'));
              }

              return;
            });
        } else {
          reject(new Error('Lack of post information'));
        }
        return;
      },
    );
  }

  public static delete(
    client: PrismaClient['post'],
    postId: string,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (reason?: any) => void) => {
        client
          .delete({
            where: {
              id: postId,
            },
          })
          .then(() => resolve())
          .catch(reject);

        return;
      },
    );
  }

  public static lovePost(
    client: PrismaClient['post'],
    postId: string,
    userId: string,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (reason?: any) => void) => {
        client
          .findUnique({
            where: {
              id: postId,
            },
          })
          .then((post: Post | null) => {
            if (post !== null) {
              client
                .update({
                  where: {
                    id: postId,
                  },
                  data: {
                    loveCount: post.loveCount + 1,
                    lover: {
                      connect: [
                        {
                          id: userId,
                        },
                      ],
                    },
                  },
                  include: {
                    lover: true,
                  },
                })
                .then(() => resolve())
                .catch(reject);
            } else reject('Invalid post information');
          });
      },
    );
  }

  public static unlovePost(
    client: PrismaClient['post'],
    postId: string,
    userId: string,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (reason?: any) => void) => {
        client
          .findUnique({
            where: {
              id: postId,
            },
          })
          .then((post: Post | null) => {
            if (post !== null) {
              client
                .update({
                  where: {
                    id: postId,
                  },
                  data: {
                    loveCount: post.loveCount - 1,
                    lover: {
                      disconnect: [
                        {
                          id: userId,
                        },
                      ],
                    },
                  },
                  include: {
                    lover: true,
                  },
                })
                .then(() => resolve())
                .catch(reject);
            } else reject('Invalid post information');
          });
      },
    );
  }

  public static bookmarkPost(
    client: PrismaClient['post'],
    postId: string,
    userId: string,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (reason?: any) => void) => {
        client
          .findUnique({
            where: {
              id: postId,
            },
          })
          .then((post: Post | null) => {
            if (post !== null) {
              client
                .update({
                  where: {
                    id: postId,
                  },
                  data: {
                    bookmaker: {
                      connect: [
                        {
                          id: userId,
                        },
                      ],
                    },
                  },
                  include: {
                    bookmaker: true,
                  },
                })
                .then(() => resolve())
                .catch(reject);
            } else reject('Invalid post information');
          });
      },
    );
  }

  public static unmarkPost(
    client: PrismaClient['post'],
    postId: string,
    userId: string,
  ): Promise<void> {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (reason?: any) => void) => {
        client
          .findUnique({
            where: {
              id: postId,
            },
          })
          .then((post: Post | null) => {
            if (post !== null) {
              client
                .update({
                  where: {
                    id: postId,
                  },
                  data: {
                    bookmaker: {
                      disconnect: [
                        {
                          id: userId,
                        },
                      ],
                    },
                  },
                  include: {
                    bookmaker: true,
                  },
                })
                .then(() => resolve())
                .catch(reject);
            } else reject('Invalid post information');
          });
      },
    );
  }

  public static async reportPost(
    client: PrismaClient,
    postId: string,
    reason: string,
    reporterId: string,
  ): Promise<Report> {
    try {
      const report = await client.report.create({
        data: {
          reason: reason,
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: reporterId,
            },
          },
        },
        include: {
          post: true,
          user: true,
        },
      });
      return report;
    } catch (err) {
      throw err;
    }
  }

  public static denyPost(client: PrismaClient['post'], postId: string) {
    return new Promise<void>(
      (resolve: (value: void) => void, reject: (reason?: any) => void) => {
        client
          .update({
            where: {
              id: postId,
            },
            data: {
              denied: true,
            },
          })
          .then(() => resolve())
          .catch(reject);
      },
    );
  }
}
