import { Transactional } from '@mikro-orm/decorators/legacy';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from 'src/database/entities/category.entity';
import { CreateCategoryDto } from './dto/requests.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly em: EntityManager) {}

  public async createCategory(data: CreateCategoryDto) {
    const category = this.em.create(Category, { name: data.name });
    await this.em.flush();
    return category;
  }

  public async getAllCategories() {
    const categories = await this.em.findAll(Category, {});
    return categories;
  }

  public async getCategory(id: string) {
    const category = await this.em.findOne(Category, id);
    if (!category) {
      throw new NotFoundException(`category ${id} does not exist`);
    }
    return category;
  }

  @Transactional()
  public async deleteCategory(id: string) {
    const category = await this.em.findOne(Category, id, {
      populate: ['products.name'],
    });

    if (!category) {
      throw new NotFoundException(`category ${id} does not exist`);
    }

    const productCount = category.products.count();
    if (productCount > 0) {
      throw new BadRequestException(
        `category ${category.name} has existing products`,
      );
    }
    this.em.remove(category);
    return category;
  }
}
