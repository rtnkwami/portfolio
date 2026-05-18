import { Controller, Post, Body, UsePipes, Get, Patch } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/request.validation.pipe';
import { CreateUserSchema } from '@atelier/contracts/schemas';
import type {
  CreateUserParams,
  UpdateProfileParams,
} from '@atelier/contracts/types';
import { User } from 'src/decorators/user.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  upsertUser(@User() userId: string, data: CreateUserParams) {
    return this.userService.upsertUser(userId, data);
  }

  @Get()
  findOne(@User() userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch(':id')
  updateProfile(@User() userId: string, @Body() data: UpdateProfileParams) {
    return this.userService.updateProfile(userId, data);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
