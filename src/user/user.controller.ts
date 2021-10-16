import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from '../types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { ExpressRequest } from '../types/expressRequest';
import { UserEntity } from './user.entity';
import { User } from './decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const loggedUser = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(loggedUser);
  }

  @Get()
  async getCurrentUser(
    @Req() request: ExpressRequest,
    @User() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }
}
