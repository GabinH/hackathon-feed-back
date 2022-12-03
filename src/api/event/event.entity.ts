import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export enum EventType {
  View = 'view',
  Click = 'click',
  Share = 'share',
  Stop = 'stop',
}

export interface EventEntity extends InMemoryDBEntity {
  type: EventType;
  date: Date;
  userId: string;
  postId: string;
}
