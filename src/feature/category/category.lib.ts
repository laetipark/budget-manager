import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entity/category.entity';

@Injectable()
export class CategoryLib {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /** 카테고리 목록 반환
   * @return Category[]
   */
  getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  /** id의 카테고리 반환
   * @return Category
   */
  getCategory(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({
      id,
    });
  }
}
