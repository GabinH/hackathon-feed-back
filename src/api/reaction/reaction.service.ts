import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';
import { IReaction, ReactionEntity } from 'src/api/reaction/reaction.entity';
import { readFileSync } from 'fs';
import { ReactionType } from 'src/api/reaction/enum';

@Injectable()
export class ReactionService {
  constructor(
    @InjectInMemoryDBService('reaction')
    private reactionMemory: InMemoryDBService<ReactionEntity>,
  ) {}

  public init() {
    this.reactionMemory.createMany(
      JSON.parse(
        readFileSync(__dirname + '/../../../mocks/reactions.json', 'utf8'),
      ),
    );
  }

  create(reaction: IReaction) {
    const oldReactions = this.reactionMemory.query(
      (oldReaction) =>
        oldReaction.postId === reaction.postId &&
        oldReaction.userId === reaction.userId,
    );
    let isSame = false;
    for (const oldReaction of oldReactions) {
      if (oldReaction.reactionType === reaction.reactionType) {
        isSame = true;
      }
      this.reactionMemory.delete(oldReaction.id);
    }
    if (!isSame) {
      return this.reactionMemory.create(reaction);
    }
    return;
  }

  getAll() {
    return this.reactionMemory.getAll();
  }

  delete(id: string) {
    this.reactionMemory.delete(id);
  }

  getReactionsByPostId(postId) {
    const reactions = this.reactionMemory.query(
      (reaction) => reaction.postId === postId,
    );
    return {
      total: reactions.length,
      like: reactions
        .filter((reaction) => reaction.reactionType === ReactionType.Like)
        .map((reaction) => reaction.userId),
      heart: reactions
        .filter((reaction) => reaction.reactionType === ReactionType.Heart)
        .map((reaction) => reaction.userId),
      sad: reactions
        .filter((reaction) => reaction.reactionType === ReactionType.Sad)
        .map((reaction) => reaction.userId),
      crossfinger: reactions
        .filter(
          (reaction) => reaction.reactionType === ReactionType.CrossFinger,
        )
        .map((reaction) => reaction.userId),
      applause: reactions
        .filter((reaction) => reaction.reactionType === ReactionType.Applause)
        .map((reaction) => reaction.userId),
    };
  }
}
