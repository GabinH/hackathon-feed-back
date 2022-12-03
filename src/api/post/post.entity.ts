import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { PostType } from 'src/api/post/enum';

export interface PostEntity extends InMemoryDBEntity {
  _id: string;
  title: string;
  type: PostType;
  content: string | string[];
  date: Date;
  highlight: boolean;
  image: string;
  link?: string;
}
