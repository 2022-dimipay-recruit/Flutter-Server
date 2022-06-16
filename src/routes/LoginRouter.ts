import {Context} from 'koa';
import got from 'got';
import admin, {initializeApp} from 'firebase-admin';

import APIRouter from '../lib/APIRouter';
import {UserRecord} from 'firebase-admin/lib/auth/user-record';

const kakaoRequestMeUrl = 'https://kapi.kakao.com/v2/user/me';

admin.initializeApp({
  // credential: admin.credential.cert(),
});

// async function createFirebaseToken(kakaoAccessToken: string) {
//   console.log(
//     'Requesting user profile from Kakao API server. ' + kakaoAccessToken,
//   );
//   const kakaoMeResult = JSON.parse(
//     (
//       await got(kakaoRequestMeUrl, {
//         method: 'GET',
//         headers: {Authorization: 'Bearer ' + kakaoAccessToken},
//         json: true,
//       })
//     ).body,
//   );
//   // let requestMeResult = await requestMe(kakaoAccessToken);
//   const userData = kakaoMeResult.data;

//   const userId = `kakao:${userData.id}`;
//   if (!userId) {
//     // return response
//     //   .status(404)
//     //   .send({message: 'There was no user with the given access token.'});
//   }

//   let nickname = null;
//   let profileImage = null;
//   if (userData.properties) {
//     nickname = userData.properties.nickname;
//     profileImage = userData.properties.profile_image;
//   }

//   const updateParams = {
//     uid: userId,
//     provider: 'KAKAO',
//     displayName: nickname,
//     email: userData.kakao_account.email,
//   };

//   if (nickname) {
//     updateParams['displayName'] = nickname;
//   } else {
//     updateParams['displayName'] = userData.kakao_account.email;
//   }
//   // if (profileImage) {
//   //   updateParams['photoURL'] = profileImage;
//   // }

//   // await updateOrCreateUser(updateParams);

//   console.log('updating or creating a firebase user');

//   let userRecord: null | UserRecord = null;

//   try {
//     userRecord = await admin.auth().getUserByEmail(updateParams['email']);
//   } catch (error: any) {
//     if (error.code || error.code === 'auth/user-not-found') {
//       return admin.auth().createUser(updateParams);
//     }
//     throw error;
//   }

//   return admin.auth().createCustomToken(userId, {provider: 'KAKAO'});
// }

class LoginRouter extends APIRouter {
  constructor() {
    super();

    this.router.post('/kakao', async (context: Context): Promise<void> => {
      const {access_token} = context.request.body;

      console.log(
        'Requesting user profile from Kakao API server. ' + access_token,
      );
      const kakaoMeResult = JSON.parse(
        (
          await got(kakaoRequestMeUrl, {
            method: 'GET',
            headers: {Authorization: 'Bearer ' + access_token},
            json: true,
          })
        ).body,
      );
      // let requestMeResult = await requestMe(access_token);
      const userData = kakaoMeResult.data;

      const userId = `kakao:${userData.id}`;
      if (!userId) {
        // return response
        //   .status(404)
        //   .send({message: 'There was no user with the given access token.'});
      }

      let nickname = null;
      let profileImage = null;
      if (userData.properties) {
        nickname = userData.properties.nickname;
        profileImage = userData.properties.profile_image;
      }

      //! Firebase 특성상 email 필드는 필수이다.
      //! 사업자등록 이후 email을 필수옵션으로 설정할 수 있으니 (카카오 개발자 사이트) 꼭 설정하자.
      //! 테스트 단계에서는 email을 동의하지 않고 로그인 할 경우 에러가 발생한다.
      const updateParams = {
        uid: userId,
        provider: 'KAKAO',
        displayName: nickname,
        email: userData.kakao_account.email,
      };

      if (nickname) {
        updateParams['displayName'] = nickname;
      } else {
        updateParams['displayName'] = userData.kakao_account.email;
      }
      if (profileImage) {
        // updateParams['photoURL'] = profileImage;
      }

      // await updateOrCreateUser(updateParams);

      console.log('updating or creating a firebase user');

      let userRecord: null | UserRecord = null;

      try {
        userRecord = await admin.auth().getUserByEmail(updateParams['email']);
      } catch (error: any) {
        if (error.code || error.code === 'auth/user-not-found') {
          userRecord = await admin.auth().createUser(updateParams);
        }
        throw error;
      }

      const resultCustomToken = admin
        .auth()
        .createCustomToken(userId, {provider: 'KAKAO'});

      // return

      context.body = {
        status: 'success',
        data: null,
      };

      return;
    });
  }
}
