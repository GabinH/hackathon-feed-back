import {
  InMemoryDBModule,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { ReactionController } from 'src/api/reaction/reaction.controller';
import { ReactionService } from 'src/api/reaction/reaction.service';

@Module({
  imports: [InMemoryDBModule.forFeature('reaction')],
  controllers: [ReactionController],
  providers: [ReactionService, InMemoryDBService],
  exports: [ReactionService],
})
export class ReactionModule {}
