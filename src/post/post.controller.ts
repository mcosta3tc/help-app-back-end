import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import { User } from '../user/decorator/user.decorator';
import { PostResponseInterface } from './types/postResponse.interface';
import { CreatePostDto } from './dto/createPost.dto';
import { AllPostsResponseInterface } from './types/AllPostsResponseInterface';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createPost(
    @User() currentUser: UserEntity,
    @Body('post') createdPostDto: CreatePostDto,
  ): Promise<PostResponseInterface> {
    const post = await this.postService.createPost(currentUser, createdPostDto);

    return this.postService.buildArticleResponse(post);
  }

  @Get()
  async getAllPost(
    @User('id') activeUserId: string,
    @Query() queryParam: any,
  ): Promise<AllPostsResponseInterface> {
    return this.postService.findAllPosts(activeUserId, queryParam);
  }

  @Get(':slug')
  async getSinglePost(
    @Param('slug') slug: string,
  ): Promise<PostResponseInterface> {
    const post = await this.postService.findPostBySlug(slug);
    return this.postService.buildArticleResponse(post);
  }

  @Post(':slug/like')
  @UseGuards(AuthGuard)
  async likePostBySlug(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
  ): Promise<PostResponseInterface> {
    const post = await this.postService.addPostToFavorite(currentUserId, slug);
    return this.postService.buildArticleResponse(post);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deletePostBySlug(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
  ) {
    return await this.postService.deletePostById(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updatePost(
    @User('id') currentUserId: string,
    @Param('slug') slug: string,
    @Body('post') updatedPost: CreatePostDto,
  ): Promise<PostResponseInterface> {
    const post = await this.postService.updatePost(
      currentUserId,
      slug,
      updatedPost,
    );
    return this.postService.buildArticleResponse(post);
  }
}
