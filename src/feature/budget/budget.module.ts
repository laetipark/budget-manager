import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { BudgetLib } from './budget.lib';
import { Budget } from '../../entity/budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), UserModule, CategoryModule],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetLib],
  exports: [BudgetLib],
})
export class BudgetModule {}
