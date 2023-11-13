import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BodyBudgetDto } from './dto/bodyBudget.dto';
import { Budget } from '../../entity/budget.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from './dto/createBudget.dto';
import { UserLib } from '../user/user.lib';
import { CategoryLib } from '../category/category.lib';
import { BudgetLib } from './budget.lib';
import { ErrorType } from '../../enum/errorType.enum';

interface CategoryRatio {
  [categoryId: number]: number;
}

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly budgetLib: BudgetLib,
    private readonly userLib: UserLib,
    private readonly categoryLib: CategoryLib,
  ) {}

  async budgetExists(userID: number) {
    const userBudgets = await this.budgetLib.getBudgetsByUser(userID);

    if (userBudgets.length > 0) {
      throw new BadRequestException(ErrorType.BUDGET_EXIST);
    }
  }

  async insertBudget(id: number, bodyBudgetDto: BodyBudgetDto[]) {
    const budgets = await this.getBudgets(id, bodyBudgetDto);

    return await this.budgetRepository.save(
      this.budgetRepository.create(budgets),
    );
  }

  async upsertBudget(id: number, bodyBudgetDto: BodyBudgetDto[]) {
    const existingBudgets = await this.budgetLib.getBudgetsByUser(id);
    const updateBudgets = await this.getBudgets(id, bodyBudgetDto);
    const budgets = [];

    for (const existingBudget of existingBudgets) {
      const matchingBudget = updateBudgets.find(
        (b) => b.category.id === existingBudget.category.id,
      );
      if (matchingBudget) {
        existingBudget.amount = matchingBudget.amount;
      }
      budgets.push(existingBudget);
    }

    return await this.budgetRepository.upsert(budgets, [
      'id',
      'user',
      'category',
    ]);
  }

  async calculateCategoryRatios(): Promise<CategoryRatio> {
    const userIDs = (await this.userLib.getUsers()).map((user) => user.id);
    const userBudgets = await this.budgetLib.getBudgetsByUsers(userIDs);

    const categoryTotalBudgets: { [categoryId: number]: number } = {};
    userBudgets.forEach((userBudget) => {
      const categoryID = userBudget.category.id;
      if (!categoryTotalBudgets[categoryID]) {
        categoryTotalBudgets[categoryID] = 0;
      }
      categoryTotalBudgets[categoryID] += Number(userBudget.amount);
    });

    const totalBudget = Object.values(categoryTotalBudgets).reduce(
      (acc, value) => acc + value,
      0,
    );

    const categoryAverageRatios: { [categoryId: number]: number } = {};
    Object.keys(categoryTotalBudgets).forEach((categoryId) => {
      const categoryTotalBudget = categoryTotalBudgets[categoryId];
      categoryAverageRatios[categoryId] =
        totalBudget && categoryTotalBudget
          ? (categoryTotalBudget / totalBudget) * 100
          : 0;
    });

    Object.keys(categoryAverageRatios).forEach((categoryId) => {
      if (categoryId !== '8' && categoryAverageRatios[categoryId] < 10) {
        categoryAverageRatios[8] =
          (categoryAverageRatios[8] || 0) + categoryAverageRatios[categoryId];
        categoryAverageRatios[categoryId] = 0;
      }
    });

    console.log(categoryAverageRatios);
    return categoryAverageRatios;
  }

  async recommendBudget(totalAmount: number, categoryRatios: CategoryRatio) {
    const recommendedBudgets: { [categoryID: number]: number } = {};

    recommendedBudgets[8] = 0;
    let remainingBudget = 0;
    Object.keys(categoryRatios).forEach((categoryID) => {
      const ratio = categoryRatios[categoryID];
      recommendedBudgets[categoryID] =
        Math.ceil((totalAmount * ratio) / 100) -
        (Math.ceil((totalAmount * ratio) / 100) % 10000);
      console.log(Math.ceil((totalAmount * ratio) / 100) % 10000);
      remainingBudget += Math.ceil((totalAmount * ratio) / 100) % 10000;
    });

    recommendedBudgets[8] += remainingBudget - (remainingBudget % 10);

    return await Promise.all(
      Object.keys(recommendedBudgets).map(async (categoryID) => {
        const category = await this.categoryLib.getCategory(Number(categoryID));

        return {
          categoryID: category.id,
          amount: recommendedBudgets[categoryID],
        };
      }),
    );
  }

  private async getBudgets(
    id: number,
    bodyBudgetDto: BodyBudgetDto[],
  ): Promise<CreateBudgetDto[]> {
    const hasDuplicateKey = (jsonArray: any[]): boolean => {
      const seenKeys: Set<number> = new Set();

      return jsonArray
        .map((obj) => obj[`categoryID`])
        .reduce((hasDuplicate, currentValue) => {
          if (seenKeys.has(currentValue)) {
            return true;
          }
          seenKeys.add(currentValue);
          return hasDuplicate;
        }, false);
    };
    const isDuplicates = hasDuplicateKey(bodyBudgetDto);
    if (isDuplicates) {
      throw new BadRequestException(ErrorType.BUDGET_DUPLICATE);
    }

    return await Promise.all(
      bodyBudgetDto.map(async (item) => {
        const user = await this.userLib.getUserById(id);
        const category = await this.categoryLib.getCategory(item.categoryID);
        if (!user) {
          throw new UnauthorizedException(ErrorType.USERNAME_NOT_EXIST);
        }
        if (!category) {
          throw new UnauthorizedException(ErrorType.CATEGORY_NOT_EXIST);
        }

        return {
          user: user,
          category: category,
          amount: item.amount,
        };
      }),
    );
  }
}
