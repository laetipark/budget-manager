import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { BudgetModule } from '../budget/budget.module';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { ExpenseLib } from './expense.lib';
import { Expense } from '../../entity/expense.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    UserModule,
    BudgetModule,
    CategoryModule,
    HttpModule.register({
      baseURL: 'https://discord.com/api/webhooks',
      timeout: 5000,
    }),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseLib],
})
export class ExpenseModule {}
