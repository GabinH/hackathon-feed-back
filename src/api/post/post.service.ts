import {
  InjectInMemoryDBService,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';
import { PostEntity } from 'src/api/post/post.entity';
import { readFileSync } from 'fs';
import { ReactionService } from 'src/api/reaction/reaction.service';
import { EventService } from 'src/api/event/event.service';
import * as moment from 'moment';
import { Ratios } from 'src/api/post/enum';

@Injectable()
export class PostService {
  constructor(
    @InjectInMemoryDBService('post')
    private postMemory: InMemoryDBService<PostEntity>,
    private readonly reactionService: ReactionService,
    private readonly eventService: EventService,
  ) {}

  public init() {
    const posts = JSON.parse(
      readFileSync(__dirname + '/../../../mocks/posts.json', 'utf8'),
    );
    posts.forEach((post, index) => {
      if (index < 5) {
        post.date = moment().format();
      } else if (index < 10) {
        const randomOneWeek = Math.floor(Math.random() * 7);
        post.date = moment().subtract(randomOneWeek, 'day').format();
      } else {
        const randomOneMonth = Math.floor(Math.random() * 30);
        post.date = moment().subtract(randomOneMonth, 'day').format();
      }
      if (!Array.isArray(post.content)) {
        post.content = post.content.substring(0, 115) + ' ...';
      }
    });
    this.postMemory.createMany(posts);
  }

  getAll() {
    return this.postMemory.getAll();
  }

  get(postId, userId) {
    const post = this.postMemory.query((post) => post._id === postId);
    return this.prepare(post, userId);
  }

  prepare(post, userId) {
    post.reaction = this.reactionService.getReactionsByPostId(post._id);
    post.event = this.eventService.getEventCountsByPostId(post._id);
    if (!this.eventService.hasStopped(post._id, userId)) {
      return this.getWeighted(post);
    }
    return;
  }

  getFeed(userId) {
    const posts: any[] = this.postMemory.getAll();
    const feed = [];
    for (const post of posts) {
      const preparedPost = this.prepare(post, userId);
      if (preparedPost) {
        feed.push(preparedPost);
      }
    }
    return feed.sort((a, b) => b.weight - a.weight);
  }

  getWeighted(post) {
    let weight = 1;
    let dateWeight: Ratios;
    if (moment(post.date).isBefore(moment().subtract(7, 'day'))) {
      dateWeight = Ratios.veryLow;
    } else if (moment(post.date).isBefore(moment().subtract(3, 'day'))) {
      dateWeight = Ratios.medium;
    } else {
      dateWeight = Ratios.veryHigh;
    }

    let viewWeight: Ratios;
    if (post.event.view > 10) {
      viewWeight = Ratios.medium;
    } else if (post.event.view > 5) {
      viewWeight = Ratios.low;
    } else {
      viewWeight = Ratios.veryLow;
    }

    let shareWeight: Ratios;
    if (post.event.share > 8) {
      shareWeight = Ratios.medium;
    } else if (post.event.share > 4) {
      shareWeight = Ratios.low;
    } else {
      shareWeight = Ratios.veryLow;
    }

    let clickWeight: Ratios;
    if (post.event.click > 8) {
      clickWeight = Ratios.medium;
    } else if (post.event.click > 4) {
      clickWeight = Ratios.low;
    } else {
      clickWeight = Ratios.veryLow;
    }

    let reactionWeight: Ratios;
    if (post.reaction.total > 8) {
      reactionWeight = Ratios.medium;
    } else if (post.reaction.total > 4) {
      reactionWeight = Ratios.low;
    } else {
      reactionWeight = Ratios.veryLow;
    }

    let randomWeight: Ratios;
    const random = this.getRandomInt(2);
    if (random === 0) {
      randomWeight = Ratios.veryLow;
    } else {
      randomWeight = Ratios.low;
    }

    let highlightWeight;
    if (post.highlight) {
      highlightWeight = Ratios.medium;
    } else {
      highlightWeight = Ratios.veryLow;
    }

    weight *= dateWeight;
    weight *= clickWeight;
    weight *= viewWeight;
    weight *= shareWeight;
    weight *= reactionWeight;
    // weight *= randomWeight;
    weight *= highlightWeight;

    post.weight = weight;
    post.weightDetail = {
      dateWeight,
      clickWeight,
      viewWeight,
      shareWeight,
      reactionWeight,
      // randomWeight,
      highlightWeight,
    };
    return post;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
}
