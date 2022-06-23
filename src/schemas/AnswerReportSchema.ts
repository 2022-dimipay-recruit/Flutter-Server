import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';
import {AnswerReport} from '@prisma/client';

export default new Schema<keyof Omit<AnswerReport, 'createdAt' | 'updatedAt'>>({
  id: schema.string().format('uuid'),
  answerId: schema.string().format('uuid'),
  userId: schema.string().format('uuid'),
  reason: schema.string().minLength(1).maxLength(4000),
});
