import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseInterface } from './types/postResponse.interface';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  private static getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async createPost(
    currentUser: UserEntity,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const post = new PostEntity();

    Object.assign(post, createPostDto);

    if (!post.tagList) {
      post.tagList = [];
    }

    post.slug = PostService.getSlug(createPostDto.title);

    post.creator = currentUser;

    return this.postRepository.save(post);
  }

  buildArticleResponse(post: PostEntity): PostResponseInterface {
    return { post };
  }

  async findPostBySlug(slug: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ slug });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async deletePostById(
    currentUserId: string,
    slug: string,
  ): Promise<DeleteResult> {
    const post = await this.findPostBySlug(slug);

    if (post.creator.id !== currentUserId) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }

    return await this.postRepository.delete({ slug });
  }

  async updatePost(
    currentUserId: string,
    slug: string,
    updatedPost: CreatePostDto,
  ): Promise<PostEntity> {
    const post = await this.findPostBySlug(slug);

    if (post.creator.id !== currentUserId) {
      throw new HttpException('Not allowed', HttpStatus.FORBIDDEN);
    }

    Object.assign(post, updatedPost);
    return this.postRepository.save(post);
  }
}
