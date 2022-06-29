import {Post, User} from '@prisma/client';
import UserController from '../controllers/UserController';
import APIRouter from '../lib/APIRouter';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import pageSchema from '../schemas/PageSchema';
import userSchema from '../schemas/UserSchema';
import {} from '../typings/ExpressRequest';

// UserRouter
export default class extends APIRouter {
  constructor() {
    super();

    this.router.post(
      '/',
      getValidationMiddleware({
        body: userSchema.getObjectSchema({
          requiredProperties: [
            'link',
            'nickname',
            'email',
            'profileImage',
            'description',
          ],
          optionalProperties: ['googleUid', 'kakaoUid'],
        }),
      }),
      (req, res): void => {
        if (
          typeof req.body.googleUid === 'string' ||
          typeof req.body.kakaoUid === 'string'
        ) {
          UserController.create(req.prismaClient.user, req.body)
            .then((userId: User['id']) => {
              res.send({
                status: 'success',
                data: {
                  userId: userId,
                },
              });

              return;
            })
            .catch((error: any) => {
              res.status(400);
              res.send({
                status: 'fail',
                data: {
                  message: error.message,
                },
              });
            });
        } else {
          res.status(400);
          res.send({
            status: 'fail',
            data: {
              message: 'Invalid social information',
            },
          });
        }

        return;
      },
    );

    this.router.get(
      '/',
      getValidationMiddleware({
        query: pageSchema,
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {
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
          },
        })
          // @ts-expect-error asdasd
          .then((user: Omit<User, 'googleUid' | 'kakaoUid'>[]) => {
            res.send({
              status: 'success',
              data: user,
            });

            return;
          })
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

    this.router.patch(
      '/id/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
        body: userSchema.getObjectSchema({
          optionalProperties: [
            'description',
            'email',
            'link',
            'nickname',
            'profileImage',
            'googleUid',
            'kakaoUid',
          ],
        }),
      }),
      (req, res): void => {
        if (req.params.id === req.userId) {
          UserController.update(req.prismaClient.user, req.params, req.body)
            .then((user: Partial<User>) => {
              res.send({
                status: 'success',
                data: [user],
              });

              return;
            })
            .catch((error: any) => {
              res.status(400);
              res.send({
                status: 'fail',
                data: {
                  message: error.message,
                },
              });
            });
        } else {
          res.status(401);
          res.send({
            status: 'fail',
            data: {
              message: 'Unauthorized user',
            },
          });
        }

        return;
      },
    );

    this.router.get(
      '/id/:id',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {user: req.params})
          // @ts-expect-error asdasd
          .then((user: User) => {
            res.send({
              status: 'success',
              data: [
                Object.assign(
                  user,
                  user.id === req.userId
                    ? undefined
                    : {googleUid: undefined, kakaoUid: undefined},
                ),
              ],
            });

            return;
          })
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

    //this.router.delete(
    //  '/id/:id',
    //  getValidationMiddleware({
    //    params: userSchema.getObjectSchema({requiredProperties: ['id']}),
    //  }),
    //  (req, res): void => {
    //    res.status(501);
    //    res.send({
    //      status: 'success',
    //      data: null,
    //    });

    //    return;
    //  },
    //);

    this.router.patch(
      '/link/:link',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
        body: userSchema.getObjectSchema({
          optionalProperties: [
            'description',
            'email',
            'link',
            'nickname',
            'profileImage',
            'googleUid',
            'kakaoUid',
          ],
        }),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {
          user: req.params,
        })
          // @ts-expect-error asdf
          .then((user: User) => {
            if (user.id === req.userId) {
              UserController.update(req.prismaClient.user, req.params, req.body)
                .then((user: Partial<User>) => {
                  res.send({
                    status: 'success',
                    data: [user],
                  });

                  return;
                })
                .catch((error: any) => {
                  res.status(400);
                  res.send({
                    status: 'fail',
                    data: {
                      message: error.message,
                    },
                  });
                });
            } else {
              res.status(401);
              res.send({
                status: 'fail',
                data: {
                  message: 'Unauthorized user',
                },
              });
            }
          })
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
      '/link/:link',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {user: req.params})
          // @ts-expect-error asdasd
          .then((user: User) => {
            res.send({
              status: 'success',
              data: [
                Object.assign(
                  user,
                  user.id === req.userId
                    ? undefined
                    : {googleUid: undefined, kakaoUid: undefined},
                ),
              ],
            });

            return;
          })
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

    //this.router.delete(
    //  '/link/:link',
    //  getValidationMiddleware({
    //    params: userSchema.getObjectSchema({requiredProperties: ['link']}),
    //  }),
    //  (req, res): void => {
    //    res.status(501);
    //    res.send({
    //      status: 'success',
    //      data: null,
    //    });

    //    return;
    //  },
    //);

    this.router.patch(
      '/googleUid/:googleUid',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['googleUid']}),
        body: userSchema.getObjectSchema({
          optionalProperties: [
            'description',
            'email',
            'link',
            'nickname',
            'profileImage',
            'googleUid',
            'kakaoUid',
          ],
        }),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {
          user: req.params,
        })
          // @ts-expect-error asdf
          .then((user: User) => {
            if (user.id === req.userId) {
              UserController.update(req.prismaClient.user, req.params, req.body)
                .then((user: Partial<User>) => {
                  res.send({
                    status: 'success',
                    data: [user],
                  });

                  return;
                })
                .catch((error: any) => {
                  res.status(400);
                  res.send({
                    status: 'fail',
                    data: {
                      message: error.message,
                    },
                  });
                });
            } else {
              res.status(401);
              res.send({
                status: 'fail',
                data: {
                  message: 'Unauthorized user',
                },
              });
            }
          })
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
      '/googleUid/:googleUid',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {user: req.params})
          // @ts-expect-error asdasd
          .then((user: User) => {
            res.send({
              status: 'success',
              data: [
                Object.assign(
                  user,
                  user.id === req.userId
                    ? undefined
                    : {googleUid: undefined, kakaoUid: undefined},
                ),
              ],
            });

            return;
          })
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

    this.router.patch(
      '/kakaoUid/:kakaoUid',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['kakaoUid']}),
        body: userSchema.getObjectSchema({
          optionalProperties: [
            'description',
            'email',
            'link',
            'nickname',
            'profileImage',
            'googleUid',
            'kakaoUid',
          ],
        }),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {
          user: req.params,
        })
          // @ts-expect-error asdf
          .then((user: User) => {
            if (user.id === req.userId) {
              UserController.update(req.prismaClient.user, req.params, req.body)
                .then((user: Partial<User>) => {
                  res.send({
                    status: 'success',
                    data: [user],
                  });

                  return;
                })
                .catch((error: any) => {
                  res.status(400);
                  res.send({
                    status: 'fail',
                    data: {
                      message: error.message,
                    },
                  });
                });
            } else {
              res.status(401);
              res.send({
                status: 'fail',
                data: {
                  message: 'Unauthorized user',
                },
              });
            }
          })
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
      '/kakaoUid/:kakaoUid',
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['link']}),
      }),
      (req, res): void => {
        UserController.read(req.prismaClient.user, {user: req.params})
          // @ts-expect-error asdasd
          .then((user: User) => {
            res.send({
              status: 'success',
              data: [
                Object.assign(
                  user,
                  user.id === req.userId
                    ? undefined
                    : {googleUid: undefined, kakaoUid: undefined},
                ),
              ],
            });

            return;
          })
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
      '/:id/bookmarks',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res): void => {
        UserController.readBookmarks(req.prismaClient.post, req.params.id)
          .then((bookmarks: Omit<Post, 'content'>[]) => {
            res.send({
              status: 'success',
              data: bookmarks,
            });

            return;
          })
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
      '/:id/loves',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res): void => {
        UserController.readLikes(req.prismaClient.post, req.params.id)
          .then((loves: Omit<Post, 'content'>[]) => {
            res.send({
              status: 'success',
              data: loves,
            });

            return;
          })
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

    // get user's posts
    this.router.get(
      '/:id/posts',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: userSchema.getObjectSchema({requiredProperties: ['id']}),
      }),
      (req, res): void => {
        UserController.readPosts(req.prismaClient.post, req.params.id)
          .then((posts: Omit<Post, 'content'>[]) => {
            res.send({
              status: 'success',
              data: posts,
            });

            return;
          })
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
  }
}
