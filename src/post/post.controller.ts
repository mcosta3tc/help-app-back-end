import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorator/user.decorator';
import { PostEntity } from './post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @User() currentUser: UserEntity,
    @Body('article') createdPost: PostEntity,
  ) {
    return this.postService.createPost(currentUser, createdPost);
  }
}
