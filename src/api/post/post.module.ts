import {
  InMemoryDBModule,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ReactionService } from 'src/api/reaction/reaction.service';
import { PostController } from 'src/api/post/post.controller';
import { PostService } from 'src/api/post/post.service';
import { EventService } from 'src/api/event/event.service';

@Module({
  imports: [
    InMemoryDBModule.forFeature('post'),
    InMemoryDBModule.forFeature('reaction'),
    InMemoryDBModule.forFeature('event'),
  ],
  controllers: [PostController],
  providers: [PostService, InMemoryDBService, ReactionService, EventService],
  exports: [PostService],
})
export class PostModule {}
