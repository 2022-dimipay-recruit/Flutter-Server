import {Context} from 'koa';
import axios from 'axios';
import admin, {ServiceAccount} from 'firebase-admin';
import {UserRecord} from 'firebase-admin/lib/auth/user-record';

import APIRouter from '../lib/APIRouter';
import Logger from '../lib/Logger';

const kakaoRequestMeUrl = 'https://kapi.kakao.com/v2/user/me';

const fbCredential: ServiceAccount = {
  // type: 'service_account',
  projectId:
    typeof process.env.FB_PROJECT_ID === 'string'
      ? process.env.FB_PROJECT_ID
      : '',
  privateKey:
    typeof process.env.FB_PRIVATE_KEY === 'string'
      ? process.env.FB_PRIVATE_KEY
      : '',
  clientEmail:
    typeof process.env.FB_CLIENT_EMAIL === 'string'
      ? process.env.FB_CLIENT_EMAIL
      : '',
  // client_id:
  //   typeof process.env.FB_CLIENT_ID === 'string'
  //     ? process.env.FB_CLIENT_ID
  //     : '',
  // auth_uri:
  //   typeof process.env.FB_AUTH_URI === 'string' ? process.env.FB_AUTH_URI : '',
  // token_uri:
  //   typeof process.env.FB_TOKEN_URI === 'string'
  //     ? process.env.FB_TOKEN_URI
  //     : '',
  // auth_provider_x509_cert_url:
  //   typeof process.env.FB_AUTH_PROVIDER_X509_CERT_URL === 'string'
  //     ? process.env.FB_AUTH_PROVIDER_X509_CERT_URL
  //     : '',
  // client_x509_cert_url:
  //   typeof process.env.FB_CLIENT_X509_CERT_URL === 'string'
  //     ? process.env.FB_CLIENT_X509_CERT_URL
  //     : '',
};

admin.initializeApp({
  credential: admin.credential.cert(fbCredential),
});

export default class LoginRouter extends APIRouter {
  private logger: Logger;

  constructor() {
    super();

    this.logger = new Logger('LoginRouter', true);

    this.router.post('/kakao', async (context: Context): Promise<void> => {
      const {access_token} = context.request.body;

      console.log(
        'Requesting user profile from Kakao API server. ' + access_token,
      );
      const kakaoMeResult = JSON.parse(
        await axios.get(kakaoRequestMeUrl, {
          method: 'GET',
          headers: {Authorization: 'Bearer ' + access_token},
        }),
      );
      // let requestMeResult = await requestMe(access_token);
      const userData = kakaoMeResult.data;

      const userId = `kakao:${userData.id}`;
      if (!userId) {
        context.body = {
          status: 'failed',
          data: {
            message: 'There was no user with the given access token.',
          },
        };
        return;
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
        photoURL: '',
      };

      if (nickname) {
        updateParams.displayName = nickname;
      } else {
        updateParams.displayName = userData.kakao_account.email;
      }
      if (profileImage) {
        updateParams.photoURL = profileImage;
      }

      // await updateOrCreateUser(updateParams);

      console.log('updating or creating a firebase user');

      let userRecord: null | UserRecord = null;

      try {
        userRecord = await admin.auth().getUserByEmail(updateParams.email);
      } catch (error: any) {
        if (error.code || error.code === 'auth/user-not-found') {
          userRecord = await admin.auth().createUser(updateParams);
        }
        throw error;
      }

      this.logger.info(userRecord);

      const resultCustomToken = admin
        .auth()
        .createCustomToken(userId, {provider: 'KAKAO'});

      // return

      context.body = {
        status: 'success',
        data: {
          token: resultCustomToken,
        },
      };

      return;
    });
  }
}
