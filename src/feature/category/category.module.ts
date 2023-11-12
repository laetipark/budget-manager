import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryLib } from './category.lib';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryLib],
})
export class CategoryModule {}
