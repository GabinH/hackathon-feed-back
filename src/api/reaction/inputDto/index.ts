import { ReactionType } from 'src/api/reaction/enum';

export class CreateReactionDto {
  postId: string;
  reactionType: ReactionType;
  userId: string;
}
