import { Module } from '@nestjs/common';
import {
  InMemoryDBModule,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { EventController } from 'src/api/event/event.controller';
import { EventService } from 'src/api/event/event.service';

@Module({
  imports: [InMemoryDBModule.forFeature('event')],
  controllers: [EventController],
  providers: [EventService, InMemoryDBService],
  exports: [EventService],
})
export class EventModule {}
