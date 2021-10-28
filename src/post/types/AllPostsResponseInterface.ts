import { PostEntity } from '../post.entity';

export interface AllPostsResponseInterface {
  allPosts: PostEntity[];
  allPostsCount: number;
}
