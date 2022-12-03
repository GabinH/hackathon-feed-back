import {Body, Controller, Get, Post} from '@nestjs/common';
import { EventService } from 'src/api/event/event.service';
import { CreateEventDto } from 'src/api/event/inputDto';
import { randomUUID } from 'crypto';
import { EventEntity } from 'src/api/event/event.entity';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto): EventEntity {
    const { postId, type, userId } = createEventDto;
    const newEvent: EventEntity = {
      id: randomUUID(),
      postId,
      type,
      date: new Date(),
      userId,
    };
    return this.eventService.create(newEvent);
  }

  @Get()
  getAllEvents() {
    return this.eventService.getAll();
  }
}
