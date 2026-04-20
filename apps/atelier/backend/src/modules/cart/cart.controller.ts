import { Controller, Body, Put, Get, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from 'src/decorators/user.decorator';
import { ZodValidationPipe } from 'src/pipes/request.validation.pipe';
import { CartSchema } from '@atelier/contracts/schemas';
import type { Cart } from '@atelier/contracts/types';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put()
  upsertCart(
    @User() userId: string,
    @Body(new ZodValidationPipe(CartSchema)) data: Cart,
  ) {
    return this.cartService.upsertCart(userId, data);
  }

  @Patch('merge')
  syncCart(
    @User() userId: string,
    @Body(new ZodValidationPipe(CartSchema)) data: Cart,
  ) {
    return this.cartService.syncCart(userId, data);
  }

  @Get()
  getCart(@User() userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete()
  deleteCart(@User() userId: string) {
    return this.cartService.deleteCart(userId);
  }
}
