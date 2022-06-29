import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';
import {Report} from '@prisma/client';

export default new Schema<keyof Omit<Report, 'createdAt' | 'updatedAt'>>({
  id: schema.string().format('uuid'),
  postId: schema.string().format('uuid'),
  userId: schema.string().format('uuid'),
  reason: schema.string().minLength(1).maxLength(4000),
});
