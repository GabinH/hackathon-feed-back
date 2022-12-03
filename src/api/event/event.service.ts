import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { EventEntity, EventType } from 'src/api/event/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectInMemoryDBService('event')
    private eventMemory: InMemoryDBService<EventEntity>,
  ) {}

  public init() {
    this.eventMemory.createMany(
      JSON.parse(
        readFileSync(__dirname + '/../../../mocks/events.json', 'utf8'),
      ),
    );
  }

  create(event: EventEntity) {
    return this.eventMemory.create(event);
  }

  getAll() {
    return this.eventMemory.getAll();
  }

  hasStopped(postId, userId) {
    const stopped = this.eventMemory.query((event) => {
      return (
        event.postId === postId &&
        event.userId === userId &&
        event.type === EventType.Stop
      );
    });
    return stopped.length > 0;
  }

  getEventsByPostId(postId) {
    return this.eventMemory.query((event) => event.postId === postId);
  }

  getEventCountsByPostId(postId) {
    const events = this.eventMemory.query((event) => event.postId === postId);
    return {
      view: events.filter((obj) => obj.type === EventType.View).length,
      click: events.filter((obj) => obj.type === EventType.Click).length,
      share: events.filter((obj) => obj.type === EventType.Share).length,
      stop: events.filter((obj) => obj.type === EventType.Stop).length,
    };
  }
}
