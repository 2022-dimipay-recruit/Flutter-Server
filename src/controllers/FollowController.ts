import {PrismaClient} from '@prisma/client';

export default class FollowController {
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

  public static async deleteFollow(
    client: PrismaClient,
    followerId: string,
    followedId: string,
  ) {
    try {
      const follows = await client.follows.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followedId,
          },
        },
      });
      return follows;
    } catch (err) {
      throw err;
    }
  }

  // read follower by follwedId
  public static async readFollower(client: PrismaClient, followedId: string) {
    try {
      const follows = await client.follows.findMany({
        where: {
          followingId: followedId,
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

  //read followed by followerId
  public static async readFollowed(client: PrismaClient, followerId: string) {
    try {
      const follows = await client.follows.findMany({
        where: {
          followerId: followerId,
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
}
