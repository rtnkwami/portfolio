import { Transactional } from '@mikro-orm/decorators/legacy';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/database/entities/category.entity';
import {
  CreateCategoryDto,
  CreateProductDto,
  ProductSearchParams,
  UpdateProductDto,
} from './dto/requests.dto';
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
  public async createProduct(data: CreateProductDto) {
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

    const dto = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category.name,
      images: product.images.toArray(),
    };

    return dto;
  }

  @Transactional()
  public async updateProduct(id: string, data: UpdateProductDto) {
    const product = await this.em.findOne(Product, id);

    if (!product) {
      throw new HttpException(
        `product ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.em.upsert(Product, { id, ...data });
    return product;
  }

  public async searchProducts(filters: ProductSearchParams) {
    const {
      name,
      minPrice,
      maxPrice,
      category,
      page = 1,
      limit = 20,
    } = filters;
    const offset = (page - 1) * limit;

    if (minPrice && maxPrice && maxPrice < minPrice) {
      throw new HttpException(
        'max price should be greater than min price',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [results, count] = await this.em.findAndCount(
      Product,
      {
        name: name ? { $ilike: name } : undefined,
        category: category ? { id: category } : undefined,
        price:
          minPrice || maxPrice ? { $gte: minPrice, $lte: maxPrice } : undefined,
      },
      {
        limit,
        offset,
        orderBy: { name: 'ASC' },
        populate: ['category', 'images'],
      },
    );

    const dto = results.map((product) => {
      const images = product.images.map((i) => i.url);
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category.name,
        images,
      };
    });

    return {
      products: dto,
      page,
      perPage: limit,
      total: count,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    };
  }

  public async getProduct(id: string) {
    const product = await this.em.findOne(Product, id, {
      populate: ['category', 'images'],
    });

    if (!product) {
      throw new HttpException(
        `product ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const images = product.images.map((i) => i.url);

    const dto = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category.name,
      images,
    };
    return dto;
  }
}
