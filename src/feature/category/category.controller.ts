import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { SuccessType } from '../../interfaces/enum/successType.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /** 카테고리 목록 조회 */
  @Get('/')
  async getCategories() {
    return {
      message: SuccessType.CATEGORY_GET,
      data: await this.categoryService.getCategories(),
    };
  }
}
