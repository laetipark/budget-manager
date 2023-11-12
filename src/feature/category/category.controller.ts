import { Controller, Get } from '@nestjs/common';
import { SuccessType } from '../../enum/successType.enum';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories() {
    return {
      message: SuccessType.USER_GET,
      data: await this.categoryService.getCategories(),
    };
  }
}
