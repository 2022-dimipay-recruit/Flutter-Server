import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';

export default new Schema({
  id: schema.string().format('uuid'),
  link: schema.string(),
  nickname: schema.string(),
  email: schema.string().format('email'),
  profileImage: schema.string().format('url'),
  description: schema.string(),
});
