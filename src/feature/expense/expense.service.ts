import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodyExpenseDto } from './dto/bodyExpense.dto';
import { Expense } from '../../entity/expense.entity';
import { ErrorType } from '../../enum/errorType.enum';
import { UserLib } from '../user/user.lib';
import { CategoryLib } from '../category/category.lib';
import { ExpenseLib } from './expense.lib';
import { SelectExpensesRequestDto } from './dto/selectExpensesRequest.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly expenseLib: ExpenseLib,
    private readonly userLib: UserLib,
    private readonly categoryLib: CategoryLib,
  ) {}

  async selectExpenses(
    id: number,
    selectExpensesDto: SelectExpensesRequestDto,
  ) {
    if (!selectExpensesDto) {
      throw new BadRequestException('');
    }

    const expenses = await this.expenseLib.getExpenses(id, selectExpensesDto);
    const totalAmount = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );
    const categoryTotals: { [key: number]: number } = {};

    // 검색된 지출 데이터에서 카테고리 별 총액 계산
    expenses.forEach((expense) => {
      const categoryId = expense.category.id;
      const amount = expense.amount;

      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += Number(amount);
    });

    const categoryAmounts = await Promise.all(
      Object.keys(categoryTotals).map(async (categoryID) => {
        const category = await this.categoryLib.getCategory(
          parseInt(categoryID),
        );
        return {
          categoryID: parseInt(categoryID),
          categoryName: category.type,
          amount: categoryTotals[categoryID],
        };
      }),
    );

    return {
      totalAmount,
      categoryAmounts,
      list: expenses.map((item) => {
        return {
          category: item.category.id,
          date: item.date,
          amount: Number(item.amount),
          location: item.location,
          content: item.content,
        };
      }),
    };
  }

  async selectExpense(id: number, userID: number) {
    return await this.checkAuthorization(id, userID);
  }

  async insertExpense(id: number, createExpenseDto: BodyExpenseDto) {
    const user = await this.userLib.getUserByID(id);
    const category = await this.categoryLib.getCategory(
      createExpenseDto.categoryID,
    );
    if (!user) {
      throw new UnauthorizedException(ErrorType.USERNAME_NOT_EXIST);
    }
    if (!category) {
      throw new UnauthorizedException(ErrorType.CATEGORY_NOT_EXIST);
    }

    await this.expenseRepository.save(
      this.expenseRepository.create({
        user: { id: id },
        category: { id: createExpenseDto.categoryID },
        ...createExpenseDto,
      }),
    );
  }

  async updateExpense(
    id: number,
    userID: number,
    bodyExpenseDto: BodyExpenseDto,
  ) {
    await this.checkAuthorization(id, userID);

    const isUpdated = await this.expenseLib.patchExpense(id, bodyExpenseDto);
    if (!isUpdated.affected) {
      throw new BadRequestException('');
    }
  }

  async updateExpenseExclude(id: number, userID: number, isExclude: boolean) {
    await this.checkAuthorization(id, userID);

    const isUpdated = await this.expenseLib.patchExpenseExclude(id, isExclude);
    if (!isUpdated.affected) {
      throw new BadRequestException('');
    }
  }

  async deleteExpense(id: number, userID: number) {
    await this.checkAuthorization(id, userID);

    return this.expenseLib.deleteExpense(id);
  }

  private async checkAuthorization(id: number, userID: number) {
    const expense = await this.expenseLib.getExpenseByID(id);
    if (!expense) {
      throw new NotFoundException('?');
    }
    if (Number(expense.userID) !== userID) {
      throw new UnauthorizedException('');
    }

    return expense;
  }
}
