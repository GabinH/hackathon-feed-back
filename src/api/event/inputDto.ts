import { EventType } from 'src/api/event/event.entity';

export class CreateEventDto {
  type: EventType;
  postId: string;
  userId: string;
}
