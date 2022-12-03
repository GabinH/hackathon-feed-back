import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { ReactionType } from 'src/api/reaction/enum';

export interface IReaction {
  _id: string;
  postId: string;
  reactionType: ReactionType;
  date: Date;
  userId: string;
}

export interface ReactionEntity extends InMemoryDBEntity, IReaction {}
