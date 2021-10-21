import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorator/user.decorator';
import { PostResponseInterface } from './types/postResponse.interface';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @User() currentUser: UserEntity,
    @Body('post') createdPostDto: CreatePostDto,
  ): Promise<PostResponseInterface> {
    const post = await this.postService.createPost(currentUser, createdPostDto);

    return this.postService.buildArticleResponse(post);
  }

  @Get(':slug')
  async getSinglePost(
    @Param('slug') slug: string,
  ): Promise<PostResponseInterface> {
    const post = await this.postService.findPostBySlug(slug);
    return this.postService.buildArticleResponse(post);
  }
}
