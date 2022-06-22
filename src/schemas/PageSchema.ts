import {Schema} from '../lib/Schema';
import schema from 'fluent-json-schema';
import userSchema from './UserSchema';

export default userSchema.getObjectSchema({
  extensions: {
    page: new Schema({
      index: schema.string().pattern(/^[1-9][0-9]+$|^[0-9]$/),
      size: schema.string().pattern(/^[1-9][0-9]+$|^[0-9]$/),
      order: schema.string().enum(['desc', 'asc']),
    }).getObjectSchema({optionalProperties: ['index', 'size', 'order']}),
  },
});
