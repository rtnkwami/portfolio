import { Transactional } from '@mikro-orm/decorators/legacy';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/database/entities/category.entity';
import { CreateCategoryDto, CreateProductParams } from './dto/requests.dto';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly em: EntityManager) {}

  public async createCategory(data: CreateCategoryDto) {
    const category = this.em.create(Category, { name: data.name });
    await this.em.flush();
    return category;
  }

  @Transactional()
  public async updateCategory(id: string, name: string) {
    const category = await this.em.findOne(Category, id);

    if (!category) {
      throw new HttpException(
        `category ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    category.name = name;
    return category;
  }

  public async getAllCategories() {
    const categories = await this.em.findAll(Category, {});
    return categories;
  }

  public async getCategory(id: string) {
    const category = await this.em.findOne(Category, id);
    if (!category) {
      throw new HttpException(
        `category ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  @Transactional()
  public async deleteCategory(id: string) {
    const category = await this.em.findOne(Category, id, {
      populate: ['products.name'],
    });

    if (!category) {
      throw new HttpException(
        `category ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const productCount = category.products.count();

    if (productCount > 0) {
      throw new HttpException(
        `category ${category.name} has existing products`,
        HttpStatus.CONFLICT,
      );
    }
    this.em.remove(category);
    return category;
  }

  // ------ PRODUCT MANAGEMENT ------

  @Transactional()
  public async createProduct(data: CreateProductParams) {
    const productData = data.product;
    const category = await this.em.findOne(Category, data.category_id);

    if (!category) {
      throw new HttpException(
        `category ${data.category_id} does not exist`,
        HttpStatus.CONFLICT,
      );
    }
    const product = this.em.create(Product, { ...productData, category });
    await this.em.flush();
    return product;
  }
}
