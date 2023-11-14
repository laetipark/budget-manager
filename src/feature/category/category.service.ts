import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryLib } from './category.lib';
import { ErrorType } from '../../enum/errorType.enum';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryLib: CategoryLib) {}

  /** 카테고리 목록 반환
   * @return Category[] */
  async getCategories() {
    const categories = await this.categoryLib.getCategories();
    if (categories.length < 1) {
      throw new NotFoundException(ErrorType.CATEGORIES_NOT_EXIST);
    }

    return categories;
  }
}
