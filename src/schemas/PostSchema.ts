import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';
import {Post} from '@prisma/client';

export default new Schema<keyof Omit<Post, 'createdAt' | 'updatedAt'>>({
  id: schema.string().format('uuid'),
  content: schema.string().minLength(1).maxLength(4000),
  isAnony: schema.boolean(),
  isCommunity: schema.boolean(),
  reveiverId: schema.string().format('uuid'),
  authorId: schema.string().format('uuid'),
  loveCount: schema.integer(),
  imageLink: schema.string(),
  denied: schema.boolean(),
  answerCount: schema.integer(),
});
