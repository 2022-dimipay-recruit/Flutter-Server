import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';
import {Answer} from '@prisma/client';

export default new Schema<keyof Omit<Answer, 'createdAt' | 'updatedAt'>>({
  id: schema.string().format('uuid'),
  content: schema.string().minLength(1).maxLength(4000),
  authorId: schema.string().format('uuid'),
  postId: schema.string().format('uuid'),
});
