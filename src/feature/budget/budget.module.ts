import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from '../../entity/budget.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { BudgetLib } from './budget.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), UserModule, CategoryModule],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetLib],
})
export class BudgetModule {}
