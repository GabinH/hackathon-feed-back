import { Body, Controller, Get, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateReactionDto } from 'src/api/reaction/inputDto';
import { ReactionService } from 'src/api/reaction/reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  createReaction(@Body() createReactionDto: CreateReactionDto) {
    const { postId, reactionType, userId } = createReactionDto;
    const newReaction = {
      _id: randomUUID(),
      postId,
      reactionType,
      date: new Date(),
      userId,
    };
    return this.reactionService.create(newReaction);
  }

  @Get()
  getAllReactions() {
    return this.reactionService.getAll();
  }
}
