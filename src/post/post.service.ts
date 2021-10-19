import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(currentUser: UserEntity, createPostDto: CreatePostDto) {
    const post = new PostEntity();

    Object.assign(post, createPostDto);

    if (!post.tagList) {
      post.tagList = [];
    }

    post.slug = 'foo';

    post.creator = currentUser;

    return this.postRepository.save(post);
  }
}
