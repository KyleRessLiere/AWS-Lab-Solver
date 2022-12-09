// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Lab, Post, Comment } = initSchema(schema);

export {
  Lab,
  Post,
  Comment
};