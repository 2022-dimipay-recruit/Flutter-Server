import {PrismaClient} from '@prisma/client';

export default class DBMiddleware {
  private static prismaClient: PrismaClient = new PrismaClient();

  public use(
    req: Express.Request,
    res: Express.Response,
    next: () => void,
  ): void {
    req.prismaClient = DBMiddleware.prismaClient;

    next();
  }
}
