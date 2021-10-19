import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
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

  async createPost(currentUser: UserEntity, createPostDto: CreatePostDto) {
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
}