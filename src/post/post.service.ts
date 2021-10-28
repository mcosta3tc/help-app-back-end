import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { PostResponseInterface } from './types/postResponse.interface';
import slugify from 'slugify';
import { AllPostsResponseInterface } from './types/AllPostsResponseInterface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async findAllPosts(
    activeUserId: string,
    queryParam: any,
  ): Promise<AllPostsResponseInterface> {
    const queryBuilder = getRepository(PostEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.creator', 'creator')
      .orderBy('posts.createdAt', 'DESC');

    const allPostsCount = await queryBuilder.getCount();

    if (queryParam.limit) {
      queryBuilder.limit(queryParam.limit);
    }

    if (queryParam.offset) {
      queryBuilder.offset(queryParam.offset);
    }

    if (queryParam.tag) {
      queryBuilder.andWhere('posts.tagList LIKE :tag', {
        tag: `%${queryParam.tag}%`,
      });
    }

    if (queryParam.creator) {
      const creator = await this.userRepository.findOne({
        username: queryParam.creator,
      });
      queryBuilder.andWhere('posts.creatorId = :id', {
        id: creator.id,
      });
    }

    const allPosts = await queryBuilder.getMany();

    return {
      allPosts,
      allPostsCount,
    };
  }

  async addPostToFavorite(
    currentUserId: string,
    slug: string,
  ): Promise<PostEntity> {
    const post = await this.findPostBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['likes'],
    });
    const notLiked =
      user.likes.findIndex((postLike) => postLike.id === post.id) === -1;

    if (notLiked) {
      user.likes.push(post);
      post.nbrLikes++;
      await this.postRepository.save(post);
      await this.userRepository.save(user);
    }

    return post;
  }

  async removePostFromFavorite(
    currentUserId: string,
    slug: string,
  ): Promise<PostEntity> {
    const post = await this.findPostBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['likes'],
    });
    const postIndex = user.likes.findIndex(
      (postLike) => postLike.id === post.id,
    );

    if (postIndex >= 0) {
      user.likes.splice(postIndex, 1);
      post.nbrLikes--;
      await this.postRepository.save(post);
      await this.userRepository.save(user);
    }

    return post;
  }
}
