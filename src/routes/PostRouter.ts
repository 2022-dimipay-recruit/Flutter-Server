import {Post, User} from '@prisma/client';
import PostController from '../controllers/PostController';
import APIRouter from '../lib/APIRouter';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import pageSchema from '../schemas/PageSchema';
import postSchema from '../schemas/PostSchema';
import userSchema from '../schemas/UserSchema';
import {} from '../typings/ExpressRequest';

// UserRouter
export default class extends APIRouter {
  constructor() {
    super();

    this.router.post(
      '/public',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
        body: postSchema.getObjectSchema({
          requiredProperties: ['title', 'content', 'isAnony'],
        }),
      }),
      (req, res): void => {
        PostController.createPublic(
          req.prismaClient.post,
          req.userId as string,
          req.body,
        )
          .then((post: Pick<Post, 'id'>) => {
            res.send({
              status: 'success',
              data: post,
            });
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.get(
      '/public',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        query: pageSchema,
      }),
      (req, res): void => {
        PostController.read(req.prismaClient.post, {
          page: {
            index:
              Number.parseInt(
                (req.query.page as Record<string, string>)?.index,
                10,
              ) || 0,
            size:
              Number.parseInt(
                (req.query.page as Record<string, string>)?.size,
                10,
              ) || 100,
            order:
              ((req.query.page as Record<string, string>)?.order as
                | 'asc'
                | 'desc') || 'asc',
            isCommunity: true,
          },
        })
          .then(
            (posts: (Post & {author: User}) | (Post & {author: User})[]) => {
              res.send({
                status: 'success',
                data: posts,
              });

              return;
            },
          )
          .catch((error: any) => {
            res.status(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });
          });

        return;
      },
    );

    this.router.post(
      '/userId/:userId',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
        body: postSchema.getObjectSchema({
          requiredProperties: ['title', 'content', 'isAnony'],
        }),
      }),
      (req, res): void => {
        PostController.createPrivate(
          req.prismaClient.post,
          req.userId as string,
          req.params.userId,
          req.body,
        )
          .then((post: Pick<Post, 'id'>) => {
            res.send({
              status: 'success',
              data: post,
            });
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.get(
      '/userId/:userId',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        query: pageSchema,
      }),
      (req, res): void => {
        PostController.read(req.prismaClient.post, {
          page: {
            index:
              Number.parseInt(
                (req.query.page as Record<string, string>)?.index,
                10,
              ) || 0,
            size:
              Number.parseInt(
                (req.query.page as Record<string, string>)?.size,
                10,
              ) || 100,
            order:
              ((req.query.page as Record<string, string>)?.order as
                | 'asc'
                | 'desc') || 'asc',
            isCommunity: false,
            userId: req.params.userId,
          },
        })
          .then(
            (posts: (Post & {author: User}) | (Post & {author: User})[]) => {
              res.send({
                status: 'success',
                data: posts,
              });

              return;
            },
          )
          .catch((error: any) => {
            res.status(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });
          });

        return;
      },
    );

    this.router.get(
      '/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res) => {
        PostController.read(req.prismaClient.post, {postId: req.params.id})
          .then((post: (Post & {author: User}) | (Post & {author: User})[]) => {
            res.send({
              status: 'success',
              data: [post],
            });

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });
      },
    );

    this.router.patch(
      '/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
        body: postSchema.getObjectSchema({
          requiredProperties: ['title', 'content'],
        }),
      }),
      (req, res) => {
        PostController.read(req.prismaClient.post, {postId: req.params.id})
          // @ts-expect-error asdasf
          .then((post: Post & {author: User}) => {
            if (post.author.id === req.userId) {
              PostController.update(
                req.prismaClient.post,
                req.params.id,
                req.body,
              )
                .then((post: Partial<Pick<Post, 'title' | 'content'>>) => {
                  res.send({
                    status: 'success',
                    data: [post],
                  });

                  return;
                })
                .catch((error: any) => {
                  res.send(400);
                  res.send({
                    status: 'fail',
                    data: {
                      message: error.message,
                    },
                  });

                  return;
                });
            } else {
              res.send(400);
              res.send({
                status: 'fail',
                data: {
                  message: 'Unauthorized user',
                },
              });
            }

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.delete(
      '/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res) => {
        PostController.read(req.prismaClient.post, {postId: req.params.id})
          // @ts-expect-error asdasf
          .then((post: Post & {author: User}) => {
            if (post.author.id === req.userId) {
              PostController.delete(req.prismaClient.post, req.params.id)
                .then(() => {
                  res.send({
                    status: 'success',
                    data: null,
                  });

                  return;
                })
                .catch((error: any) => {
                  res.send(400);
                  res.send({
                    status: 'fail',
                    data: {
                      message: error.message,
                    },
                  });

                  return;
                });
            } else {
              res.send(400);
              res.send({
                status: 'fail',
                data: {
                  message: 'Unauthorized user',
                },
              });
            }

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.post(
      '/:id/love',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res) => {
        PostController.lovePost(
          req.prismaClient.post,
          req.params.id,
          req.userId as string,
        )
          .then(() => {
            res.send({
              status: 'success',
              data: {
                id: req.params.id,
              },
            });

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.delete(
      '/:id/love',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res) => {
        PostController.unlovePost(
          req.prismaClient.post,
          req.params.id,
          req.userId as string,
        )
          .then(() => {
            res.send({
              status: 'success',
              data: null,
            });

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.post(
      '/:id/bookmark',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res) => {
        PostController.bookmarkPost(
          req.prismaClient.post,
          req.params.id,
          req.userId as string,
        )
          .then(() => {
            res.send({
              status: 'success',
              data: {
                id: req.params.id,
              },
            });

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );

    this.router.delete(
      '/:id/bookmark',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: postSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res) => {
        PostController.unmarkPost(
          req.prismaClient.post,
          req.params.id,
          req.userId as string,
        )
          .then(() => {
            res.send({
              status: 'success',
              data: null,
            });

            return;
          })
          .catch((error: any) => {
            res.send(400);
            res.send({
              status: 'fail',
              data: {
                message: error.message,
              },
            });

            return;
          });

        return;
      },
    );
  }
}
