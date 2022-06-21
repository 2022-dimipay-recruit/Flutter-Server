import {PrismaClient, Post} from '@prisma/client';

export default class PostController {
  public static async createPublic(
    client: PrismaClient,
    authorId: string,
    postData: Pick<Post, 'title' | 'content' | 'isAnony'>,
  ) {
    const post = await client.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        isAnony: postData.isAnony,
        isCommunity: true,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });

    return post;
  }

  public static async createPrivate(
    client: PrismaClient,
    authorId: string,
    receiverId: string,
    postData: Pick<Post, 'title' | 'content' | 'isAnony'>,
  ) {
    const post = await client.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        isAnony: postData.isAnony,
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
      },
      include: {
        author: true,
        reveiver: true,
      },
    });

    return post;
  }
}
