import {PrismaClient} from '@prisma/client';
import {Page} from '../typings/CustomType';

export default class FollowController {
  /**
   * 팔로우를 생성하는 함수입니다.
   * @param client PrismaClient를 넘깁니다.
   * @param followerId 팔로우하는 사람의 id를 넘깁니다.
   * @param followedId 팔로우받는 사람의 id를 넘깁니다.
   * @returns 팔로우 정보를 넘깁니다.
   */
  public static async createFollow(
    client: PrismaClient,
    followerId: string,
    followedId: string,
  ) {
    try {
      const follows = await client.follows.create({
        data: {
          follower: {
            connect: {
              id: followerId,
            },
          },
          following: {
            connect: {
              id: followedId,
            },
          },
        },
        include: {
          follower: true,
          following: true,
        },
      });
      return follows;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 팔로우를 삭제하는 함수입니다.
   * 팔로우를 만들 때 줬던 정보를 그대로 줘야 합니다.
   * @param client PrismaClient를 넘깁니다.
   * @param followerId 팔로우하는 사람의 id를 넘깁니다.
   * @param followedId 팔로우받는 사람의 id를 넘깁니다.
   * @returns 삭제된 팔로우의 정보를 넘깁니다.
   */
  public static async deleteFollow(client: PrismaClient, followDataId: string) {
    try {
      const follows = await client.follows.delete({
        where: {
          id: followDataId,
        },
        include: {
          follower: true,
          following: true,
        },
      });
      return follows;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 팔로우를 조회하는 함수입니다.
   * 사용자의 ID를 넣으면 "그 사람을 팔로우한" 정보를 받습니다.
   * @param client PrismaClient를 넘깁니다.
   * @param followedId 팔로우받는 사람의 id를 넘깁니다.
   * @returns 팔로우 정보 배열을 넘깁니다.
   */
  public static async readFollower(
    client: PrismaClient,
    followedId: string,
    page: Page,
  ) {
    try {
      const followCount = await client.follows.count({
        where: {
          followingId: followedId,
        },
      });

      if (followCount > 0) {
        if (
          page.index < Math.ceil(followCount / page.size) &&
          page.index >= 0
        ) {
          const follows = await client.follows.findMany({
            where: {
              followingId: followedId,
            },
            include: {
              follower: true,
              following: true,
            },
            skip: page.size * page.index,
            take: page.size,
            orderBy: {
              followerId: page.order === 'desc' ? 'desc' : 'asc',
            },
          });
          return follows;
        } else {
          throw new Error('Invalid page information');
        }
      } else {
        return [];
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * 팔로우를 조회하는 함수입니다.
   * 사용자의 ID를 넣으면 "그 사람이 팔로우한" 정보를 받습니다.
   * @param client PrismaClient를 넘깁니다.
   * @param followerId 팔로우하는 사람의 id를 넘깁니다.
   * @returns 팔로우 정보 배열을 넘깁니다.
   */
  public static async readFollowed(
    client: PrismaClient,
    followerId: string,
    page: Page,
  ) {
    try {
      const followCount = await client.follows.count({
        where: {
          followerId: followerId,
        },
      });

      if (followCount > 0) {
        if (
          page.index < Math.ceil(followCount / page.size) &&
          page.index >= 0
        ) {
          const follows = await client.follows.findMany({
            where: {
              followerId: followerId,
            },
            include: {
              follower: true,
              following: true,
            },
            skip: page.size * page.index,
            take: page.size,
            orderBy: {
              followingId: page.order === 'desc' ? 'desc' : 'asc',
            },
          });

          return follows;
        } else {
          throw new Error('Invalid page information');
        }
      } else {
        return [];
      }
    } catch (err) {
      throw err;
    }
  }
}
