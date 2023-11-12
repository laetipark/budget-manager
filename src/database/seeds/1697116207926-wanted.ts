import { MigrationInterface, QueryRunner } from 'typeorm';
import { Category } from '../../entity/category.entity';
import { CreateCategoryDto } from '../../feature/category/dto/createCategory.dto';

const categories: CreateCategoryDto[] = [
  {
    type: '식비',
  },
  {
    type: '주거비',
  },
  {
    type: '교통비',
  },
  {
    type: '의류',
  },
  {
    type: '문화 및 여가',
  },
  {
    type: '의료 및 건강',
  },
  {
    type: '교육',
  },
  {
    type: '기타',
  },
];

export class Wanted1697116207926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(Category, categories);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      categories.map((seed) =>
        queryRunner.manager.delete(Category, { type: seed.type }),
      ),
    );
  }
}
