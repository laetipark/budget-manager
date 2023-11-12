import { Injectable } from '@nestjs/common';
import { CategoryLib } from './category.lib';

@Injectable()
export class CategoryService {
  // @ts-ignore
  constructor(private readonly categoryLib: CategoryLib) {}

  getCategories() {
    return this.categoryLib.getCategories();
  }
}
