import {PrismaClient} from '@prisma/client';
import NotifyController, {NotifyTypes} from './NotifyController';

export default class AnswerController {
  /**
   * 답변을 등록하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params authorId 답변을 쓴 사람의 id를 넘깁니다.
   * @params postId 답변을 쓸 게시글의 id를 넘깁니다.
   * @params content 답변의 내용을 넘깁니다.
   * @returns 등록된 답변의 정보를 넘깁니다.
   */
  public static async createAnswer(
    client: PrismaClient,
    authorId: string,
    postId: string,
    content: string,
    isAnony: boolean,
  ) {
    try {
      const post = await client.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (post === null) throw new Error('게시글이 존재하지 않습니다.');
      const answer = await client.answer.create({
        data: {
          content: content,
          isAnony: isAnony,
          author: {
            connect: {
              id: authorId,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
        include: {
          author: true,
          post: true,
        },
      });
      await NotifyController.createNotify(
        client,
        NotifyTypes.NEW_ANSWER,
        answer.id,
        `${answer.author.nickname}님이 내 글에 새 답변을 올렸습니다!`,
        answer.authorId,
      );
      await client.post.update({
        where: {
          id: postId,
        },
        data: {
          answerCount: post.answerCount + 1,
        },
      });
      return answer;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 답변을 삭제하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params answerId 삭제할 답변의 id를 넘깁니다.
   * @returns 삭제된 답변의 정보를 넘깁니다.
   */
  public static async deleteAnswer(client: PrismaClient, answerId: string) {
    try {
      const answer = await client.answer.delete({
        where: {
          id: answerId,
        },
        include: {
          post: true,
        },
      });
      await client.post.update({
        where: {
          id: answer.post.id,
        },
        data: {
          answerCount: answer.post.answerCount - 1,
        },
      });
      return answer;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 답변을 수정하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params answerId 수정할 답변의 id를 넘깁니다.
   * @params content 수정할 답변의 내용을 넘깁니다.
   * @returns 수정된 답변의 정보를 넘깁니다.
   */
  public static async updateAnswer(
    client: PrismaClient,
    answerId: string,
    content: string,
  ) {
    try {
      const answer = await client.answer.update({
        where: {
          id: answerId,
        },
        data: {
          content: content,
        },
      });
      return answer;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 특정 글의 답변을 조회하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params postId 조회할 게시글의 id를 넘깁니다.
   * @returns 게시글의 답변 목록을 넘깁니다.
   */
  public static async getAnswersByPost(client: PrismaClient, postId: string) {
    try {
      const answers = await client.answer.findMany({
        where: {
          post: {
            id: postId,
          },
        },
      });
      return answers;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 특정 유저의 전체 답변을 조회하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params authorId 조회할 유저의 id를 넘깁니다.
   * @returns 유저의 답변 목록을 넘깁니다.
   */
  public static async getAnswersByAuthor(
    client: PrismaClient,
    authorId: string,
  ) {
    try {
      const answers = await client.answer.findMany({
        where: {
          author: {
            id: authorId,
          },
        },
      });
      return answers;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 답변을 신고하는 함수입니다.
   * @params client PrismaClient를 넘깁니다.
   * @params answerId 신고할 답변의 id를 넘깁니다.
   * @params userId 신고한 유저의 id를 넘깁니다
   * @params reason 신고의 이유를 넘깁니다.
   * @returns 신고된 답변의 정보를 넘깁니다.
   */
  public static async reportAnswer(
    client: PrismaClient,
    answerId: string,
    userId: string,
    reason: string,
  ) {
    try {
      const report = client.answerReport.create({
        data: {
          answer: {
            connect: {
              id: answerId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          reason: reason,
        },
        include: {
          answer: true,
          user: true,
        },
      });
      return report;
    } catch (err) {
      throw err;
    }
  }
}
