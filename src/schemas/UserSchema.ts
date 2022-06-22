import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';

export default new Schema({
  id: schema.string().format('uuid'),
  link: schema
    .string()
    .minLength(6)
    .maxLength(16)
    .pattern(/[a-z0-9]/),
  nickname: schema.string().minLength(3).maxLength(20),
  email: schema.string().format('email'),
  profileImage: schema.string().format('url'),
  description: schema.string(),
  googleUid: schema.string().pattern(/^[a-zA-Z0-9]+$/),
  kakaoUid: schema.string().pattern(/^kakao:[0-9]+$/),
  //type: schema.string().enum(['G', 'K']),
});
