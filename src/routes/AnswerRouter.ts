import APIRouter from '../lib/APIRouter';
import getAuthenticationMiddleware from '../middlewares/AuthenticationMiddleware';
import getValidationMiddleware from '../middlewares/ValidationMiddleware';
import AnswerSchema from '../schemas/AnswerSchema';
import AnswerController from '../controllers/AnswerController';
import ReportSchema from '../schemas/ReportSchema';

export default class AnswerRouter extends APIRouter {
  constructor() {
    super();

    this.router.post(
      '/create',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        body: AnswerSchema.getObjectSchema({
          requiredProperties: ['postId', 'content', 'isAnony'],
        }),
      }),
      (req, res) => {
        AnswerController.createAnswer(
          req.prismaClient,
          req.userId as string,
          req.body.postId,
          req.body.content,
          req.body.isAnony,
        )
          .then(answer => {
            res.send({
              status: 'success',
              data: answer,
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

    // get answers with postid
    this.router.get(
      '/get/post/:postId',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: AnswerSchema.getObjectSchema({
          requiredProperties: ['postId'],
        }),
      }),
      (req, res) => {
        AnswerController.getAnswersByPost(
          req.prismaClient,
          req.params.postId as string,
        )
          .then(answers => {
            res.send({
              status: 'success',
              data: answers,
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
          });
      },
    );

    // get answers with authorid
    this.router.get(
      '/get/author/:authorId',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: AnswerSchema.getObjectSchema({
          requiredProperties: ['authorId'],
        }),
      }),
      (req, res) => {
        AnswerController.getAnswersByPost(
          req.prismaClient,
          req.params.authorId as string,
        )
          .then(answers => {
            res.send({
              status: 'success',
              data: answers,
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
          });
      },
    );

    // report answer with userid and reason
    this.router.post(
      '/report/:answerId',
      getAuthenticationMiddleware(),
      getValidationMiddleware({
        params: AnswerSchema.getObjectSchema({
          requiredProperties: ['id'],
        }),
        body: ReportSchema.getObjectSchema({
          requiredProperties: ['reason'],
        }),
      }),
      (req, res) => {
        AnswerController.reportAnswer(
          req.prismaClient,
          req.params.answerId as string,
          req.userId as string,
          req.body.reason,
        )
          .then(() => {
            res.send({
              status: 'success',
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
          });
      },
    );
  }
}
