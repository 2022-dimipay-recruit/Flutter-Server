import {PrismaClient} from '@prisma/client';

export enum NotifyTypes {
  NEW_POST = 'NEW_POST',
  NEW_ANSWER = 'NEW_ANSWER',
  NEW_REPORT = 'NEW_REPORT',
  NEW_FOLLOW = 'NEW_FOLLOW',
}

export default class NotifyController {
  /**
   * 알림을 등록하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params type 알림의 종류를 넘깁니다.
   * @params linkedID 알림을 연결할 자식의 id를 넘깁니다.
   * @params content 알림의 내용을 넘깁니다.
   * @params userId 알림을 받을 사용자의 id를 넘깁니다.
   * @returns 등록된 알림의 정보를 넘깁니다.
   */
  public static async createNotify(
    client: PrismaClient,
    type: NotifyTypes,
    linkedID: string,
    content: string,
    userId: string,
  ) {
    try {
      const notify = await client.notifications.create({
        data: {
          type: type,
          linkedID: linkedID,
          content: content,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          user: true,
        },
      });
      return notify;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 알림을 삭제하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params notifyId 삭제할 알림의 id를 넘깁니다.
   * @returns 삭제된 알림의 정보를 넘깁니다.
   */
  public static async deleteNotify(client: PrismaClient, notifyId: string) {
    try {
      const notify = await client.notifications.delete({
        where: {
          id: notifyId,
        },
      });
      return notify;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 알림 목록을 불러오는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params userId 알림 목록을 불러올 사용자의 id를 넘깁니다.
   * @returns 사용자의 알림 목록을 넘깁니다.
   */
  public static async getNotifyList(client: PrismaClient, userId: string) {
    try {
      const notifyList = await client.notifications.findMany({
        where: {
          user: {
            id: userId,
          },
        },
      });
      return notifyList;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 알림을 읽음 처리하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params notifyId 읽음 처리할 알림의 id를 넘깁니다.
   * @returns 읽음 처리된 알림의 정보를 넘깁니다.
   */
  public static async readNotify(client: PrismaClient, notifyId: string) {
    try {
      const notify = await client.notifications.update({
        where: {
          id: notifyId,
        },
        data: {
          isRead: true,
        },
      });
      return notify;
    } catch (err) {
      throw err;
    }
  }
}
