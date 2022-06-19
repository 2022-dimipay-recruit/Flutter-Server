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

interface KakaoMeResult {
  id: number;
  has_signed_up?: boolean;
  connected_at?: string;
  synched_at?: string;
  properties?: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account?: {
    profile_needs_agreement?: boolean;
    profile_nickname_needs_agreement?: boolean;
    profile_image_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    name_needs_agreement?: boolean;
    name?: string;
    has_email?: boolean;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    age_range_needs_agreement?: boolean;
    age_range?: string;
    birthyear_needs_agreement?: boolean;
    birthyear?: number;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    birthday_type?: string;
    gender_needs_agreement?: boolean;
    gender?: string;
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
    ci_needs_agreement?: boolean;
    ci?: string;
    ci_authenticated_at?: string;
  };
}

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

      this.logger.info(
        'Requesting user profile from Kakao API server. ' + access_token,
      );

      let kakaoMeResult: KakaoMeResult;

      try {
        kakaoMeResult = (
          await axios.get(kakaoRequestMeUrl, {
            method: 'GET',
            headers: {Authorization: `Bearer ${access_token}`},
          })
        ).data;
      } catch (error) {
        this.logger.error(
          `Failed to get user profile from Kakao API server : ${access_token}`,
        );
        context.body = {
          status: 'failed',
          data: {
            message: 'Failed to get user profile from Kakao API server.',
          },
        };
        return;
      }

      // const kakaoMeResult = JSON.parse(kakaoResult.data);
      // let requestMeResult = await requestMe(access_token);
      const userData = kakaoMeResult;

      const userId = `kakao:${userData.id}`;
      if (!userData.id) {
        context.body = {
          status: 'failed',
          data: {
            message: 'There was no user with the given access token.',
          },
        };
        return;
      }

      let nickname = null;
      let profileImage = null;
      if (userData.properties) {
        nickname = userData.properties.nickname;
        profileImage = userData.properties?.profile_image;
      }

      //! Firebase 특성상 email 필드는 필수이다.
      //! 사업자등록 이후 email을 필수옵션으로 설정할 수 있으니 (카카오 개발자 사이트) 꼭 설정하자.
      //! 테스트 단계에서는 email을 동의하지 않고 로그인 할 경우 에러가 발생한다.
      const updateParams = {
        uid: userId,
        provider: 'KAKAO',
        displayName: nickname,
        email: userData.kakao_account?.email,
        photoURL: '',
      };

      if (nickname) {
        updateParams.displayName = nickname;
      } else {
        updateParams.displayName = userData.kakao_account?.email || '';
      }
      if (profileImage) {
        updateParams.photoURL = profileImage;
      }

      // await updateOrCreateUser(updateParams);

      console.log('updating or creating a firebase user');

      let userRecord: null | UserRecord = null;

      try {
        if (updateParams.email)
          userRecord = await admin.auth().getUserByEmail(updateParams.email);
      } catch (error: any) {
        if (error.code || error.code === 'auth/user-not-found') {
          userRecord = await admin.auth().createUser(updateParams);
        } else throw error;
      }

      this.logger.info(userRecord);

      const resultCustomToken = await admin
        .auth()
        .createCustomToken(userId, {provider: 'KAKAO'});

      this.logger.info(`Custom token created : ${resultCustomToken}`);

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
