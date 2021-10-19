import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  async createPost() {
    return 'created from service';
  }
}
