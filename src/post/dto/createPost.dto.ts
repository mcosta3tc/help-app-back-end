import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly content: string;

  tagList?: string[];
}
