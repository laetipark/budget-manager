import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Expense } from '../../entity/expense.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { ExpenseLib } from './expense.lib';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), UserModule, CategoryModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseLib],
})
export class ExpenseModule {}
