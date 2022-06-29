import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';
import {Notifications} from '@prisma/client';

export default new Schema<keyof Omit<Notifications, 'createdAt'>>({
  id: schema.string().format('uuid'),
  linkedID: schema.string().format('uuid'),
  type: schema.string().minLength(4).maxLength(6),
  content: schema.string().minLength(1).maxLength(4000),
  isRead: schema.boolean(),
  userId: schema.string().format('uuid'),
});
