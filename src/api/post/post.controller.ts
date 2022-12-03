import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from 'src/api/post/post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':userId')
  getAllPosts(@Param('userId') userId: string) {
    return this.postService.getFeed(userId);
  }

  @Get('/id/:postId/userId/:userId')
  getPost(@Param('postId') postId: string, @Param('userId') userId: string) {
    return this.postService.get(postId, userId);
  }
}
