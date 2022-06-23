import {PrismaClient, User} from '@prisma/client';

// UserController
export default class {
  public static create(
    client: PrismaClient['user'],
    user: Omit<User, 'id'>,
  ): Promise<string> {
    return new Promise(
      (resolve: (value: string) => void, reject: (reason?: any) => void) => {
        client
          .findMany({
            select: {
              id: true,
            },
            where: {
              OR: [
                {
                  link: user.link,
                },
                {
                  gooogleUid: user.gooogleUid,
                },
                {
                  kakaoUid: user.kakaoUid,
                },
              ],
            },
          })
          .then((users: Pick<User, 'id'>[]) => {
            if (users.length === 0) {
              client
                .create({
                  select: {
                    id: true,
                  },
                  data: user,
                })
                .then((user: Pick<User, 'id'>) => {
                  resolve(user.id);

                  return;
                })
                .catch(reject);
            } else {
              reject(new Error('Duplicated unique user information'));
            }

            return;
          })
          .catch(reject);
        return;
      },
    );
  }
  public static update(
    client: PrismaClient['user'],
    userCondition: Partial<
      Pick<User, 'id' | 'link' | 'gooogleUid' | 'kakaoUid'>
    >,
    user: Partial<Omit<User, 'id'>>,
  ): Promise<Partial<User>> {
    return new Promise<Partial<User>>(
      (
        resolve: (value: Partial<User>) => void,
        reject: (reason?: any) => void,
      ) => {
        if (
          typeof userCondition.id === 'string' ||
          typeof userCondition.link === 'string' ||
          typeof userCondition.gooogleUid === 'string' ||
          typeof userCondition.kakaoUid === 'string'
        ) {
          if (Object.keys(userCondition).length === 1) {
            client
              .findFirst({
                select: {
                  id: true,
                },
                where: userCondition,
              })
              .then((_user: Pick<User, 'id'> | null) => {
                if (_user !== null) {
                  const userFields: (keyof typeof user)[] = Object.keys(
                    user,
                  ) as (keyof typeof user)[];
                  const userFieldConditions: Partial<
                    Record<keyof typeof user, boolean>
                  > = {};

                  for (let i = 0; i < userFields['length']; i++) {
                    userFieldConditions[userFields[i]] = true;
                  }

                  client
                    .update({
                      select: Object.assign(
                        {
                          id: true,
                          link: true,
                          gooogleUid: true,
                          kakaoUid: true,
                        },
                        userFieldConditions,
                      ),
                      where: {
                        id: _user.id,
                      },
                      data: user,
                    })
                    .then(resolve)
                    .catch(reject);
                } else {
                  reject(new Error('Invalid user information'));
                }

                return;
              })
              .catch(reject);
          } else {
            reject(new Error('Duplicated userCondition'));
          }
        } else {
          reject(new Error('Lack of user information'));
        }

        return;
      },
    );
  }
  public static read(
    client: PrismaClient['user'],
    condition: {
      user?: Partial<Pick<User, 'id' | 'link' | 'gooogleUid' | 'kakaoUid'>>;
      page?: {size: number; index: number; order?: 'asc' | 'desc'};
    },
  ): Promise<User | Omit<User, 'googleUid' | 'kakaoUid'>[]> {
    return new Promise<User | Omit<User, 'googleUid' | 'kakaoUid'>[]>(
      (
        resolve: (value: User | Omit<User, 'googleUid' | 'kakaoUid'>[]) => void,
        reject: (reason?: any) => void,
      ) => {
        if (typeof condition.page === 'object') {
          client
            .count()
            .then((userCount: number) => {
              if (userCount > 0) {
                if (
                  // @ts-expect-error typescript's fault
                  condition.page.index <
                    Math.ceil(
                      // @ts-expect-error typescript's fault
                      userCount / condition.page.size,
                    ) &&
                  // @ts-expect-error typescript's fault
                  condition.page.index >= 0
                ) {
                  client
                    .findMany({
                      select: {
                        id: true,
                        link: true,
                        nickname: true,
                        email: true,
                        profileImage: true,
                        description: true,
                        createdAt: true,
                      },
                      // @ts-expect-error typescript's fault
                      skip: condition.page.size * condition.page.index,
                      // @ts-expect-error typescript's fault
                      take: condition.page.size,
                      orderBy: {
                        // @ts-expect-error typescript's fault
                        id: condition.page.order === 'desc' ? 'desc' : 'asc',
                      },
                    })
                    // @ts-expect-error prisma's fault
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
        } else if (typeof condition.user === 'object') {
          if (
            typeof condition.user.id === 'string' ||
            typeof condition.user.link === 'string' ||
            typeof condition.user.gooogleUid === 'string' ||
            typeof condition.user.kakaoUid === 'string'
          ) {
            if (Object.keys(condition.user).length === 1) {
              client
                .findFirst({
                  where: condition.user,
                })
                .then((user: User | null) => {
                  if (user !== null) {
                    resolve(user);
                  } else {
                    reject(new Error('Invalid user information'));
                  }

                  return;
                });
            } else {
              reject(new Error('Duplicated user condition'));
            }
          } else {
            reject(new Error('Lack of user information'));
          }
        } else {
          reject(new Error('Lack of user information'));
        }
        return;
      },
    );
  }
  public static delete(client: PrismaClient['user']): void {
    // TODO: implement later
    return;
  }
}
