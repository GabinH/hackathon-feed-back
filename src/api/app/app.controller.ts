import { Controller, Get, Param } from '@nestjs/common';
import { ReactionService } from 'src/api/reaction/reaction.service';
import { PostService } from 'src/api/post/post.service';
import { EventService } from 'src/api/event/event.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fakerator = require('fakerator')('fr-FR');

@Controller()
export class AppController {
  constructor(
    private readonly postService: PostService,
    private readonly reactionService: ReactionService,
    private readonly eventService: EventService,
  ) {
    postService.init();
    if (process.env.STAGE !== 'dev') {
      eventService.init();
      reactionService.init();
    }
  }
  @Get('/random-name')
  getRandomName() {
    return { name: fakerator.names.name() };
  }
}
