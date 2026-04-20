import { Transactional } from '@mikro-orm/decorators/legacy';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import type {
  CreateUserParams,
  UpdateProfileParams,
} from '@atelier/contracts/types';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  public async upsertUser(userId: string, data: CreateUserParams) {
    const { email, avatar } = data;

    const user = this.em.create(User, {
      id: userId,
      name: email,
      email,
      avatar,
    });
    await this.em.flush();

    return user;
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  public async getProfile(id: string) {
    const user = await this.em.findOne(User, id);

    if (!user) {
      throw new NotFoundException(`User ${id} does not exist`);
    }
    return user;
  }

  @Transactional()
  public async updateProfile(id: string, data: UpdateProfileParams) {
    const user = await this.em.findOne(User, id);

    if (!user) {
      throw new NotFoundException(`User ${id} does not exist`);
    }
    wrap(user).assign(data);

    return user;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
