import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryParams } from './dto/category-params.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // --- CATEGORY ENDPOINTS ---

  @Post('categories')
  public async createCategory(@Body() data: CreateCategoryDto) {
    return this.inventoryService.createCategory(data);
  }

  @Get('categories')
  public async getAllCategories() {
    const categories = await this.inventoryService.getAllCategories();
    return { categories };
  }

  @Get('categories/:id')
  public async getCategory(@Param() params: CategoryParams) {
    return this.inventoryService.getCategory(params.id);
  }

  @Delete('categories/:id')
  public async deleteCategory(@Param() params: CategoryParams) {
    return this.inventoryService.deleteCategory(params.id);
  }

  // --- PRODUCT ENDPOINTS ---
}
