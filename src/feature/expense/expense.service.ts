import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { BodyExpenseDto } from './dto/bodyExpense.dto';
import { Expense } from '../../entity/expense.entity';
import { ErrorType } from '../../interfaces/enum/errorType.enum';
import { UserLib } from '../user/user.lib';
import { CategoryLib } from '../category/category.lib';
import { ExpenseLib } from './expense.lib';
import { SelectExpensesRequestDto } from './dto/selectExpensesRequest.dto';
import { BudgetLib } from '../budget/budget.lib';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly expenseLib: ExpenseLib,
    private readonly userLib: UserLib,
    private readonly categoryLib: CategoryLib,
    private readonly budgetLib: BudgetLib,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /** 지출 목록 반환
   * @param id 사용자 생성 ID
   * @param selectExpensesDto 지출 조회 조건 */
  async selectExpenses(
    id: number,
    selectExpensesDto: SelectExpensesRequestDto,
  ) {
    const expenses = await this.expenseLib.getExpenses(id, selectExpensesDto);
    const totalAmount = this.getTotalAmount(expenses);
    const categoryAmounts = await this.getCategoryAmounts(expenses);

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
          isExclude: item.isExclude,
        };
      }),
    };
  }

  /** 지출 상세 조회
   * @param id 지출 ID
   * @param userID 사용자 생성 ID */
  async selectExpense(id: number, userID: number) {
    return await this.checkAuthorization(id, userID);
  }

  /** 지출 정보 추가
   * @param id 지출 ID
   * @param bodyExpenseDto 추가 요청 지출 정보 */
  async insertExpense(id: number, bodyExpenseDto: BodyExpenseDto) {
    const category = await this.categoryLib.getCategory(
      bodyExpenseDto.categoryID,
    );
    if (!category) {
      throw new NotFoundException(ErrorType.CATEGORY_NOT_EXIST);
    }

    await this.expenseRepository.save(
      this.expenseRepository.create({
        user: { id: id },
        category: { id: bodyExpenseDto.categoryID },
        ...bodyExpenseDto,
      }),
    );
  }

  /** 지출 정보 변경
   * @param id 지출 ID
   * @param userID 사용자 생성 ID
   * @param bodyExpenseDto 추가 요청 지출 정보 */
  async updateExpense(
    id: number,
    userID: number,
    bodyExpenseDto: BodyExpenseDto,
  ) {
    await this.checkAuthorization(id, userID);

    const isUpdated = await this.expenseLib.patchExpense(id, bodyExpenseDto);
    if (!isUpdated.affected) {
      throw new InternalServerErrorException(ErrorType.EXPENSE_UPDATE_FAILED);
    }
  }

  /** 지출 합계 제외 정보 변경
   * @param id 지출 ID
   * @param userID 사용자 생성 ID
   * @param isExclude 합계 제외 여부 */
  async updateExpenseExclude(id: number, userID: number, isExclude: boolean) {
    await this.checkAuthorization(id, userID);

    const isUpdated = await this.expenseLib.patchExpenseExclude(id, isExclude);
    if (!isUpdated.affected) {
      throw new InternalServerErrorException(ErrorType.EXPENSE_UPDATE_FAILED);
    }
  }

  /** 지출 정보 삭제
   * @param id 지출 ID
   * @param userID 사용자 생성 ID */
  async deleteExpense(id: number, userID: number) {
    await this.checkAuthorization(id, userID);

    return this.expenseLib.deleteExpense(id);
  }

  /** 오늘 지출 추천 반환
   * @param id 지출 ID */
  @Cron('0 8 * * *')
  async selectExpenseRecommendation(id: number) {
    if (!id) {
      const users = await this.userLib.getUsers(`isRecommendNotified`);
      const promises = [];

      users.map(async (user) => {
        const { totalBudget, categoryBudget } = await this.getMonthlyExpenses(
          user.id,
        );

        let emailContent = `<h3>💼 전체 지출 현황</h3>`;
        emailContent += `<h4>🗓️ 총 월별 예산 / 남은 예산</h4>`;
        emailContent += `<span>- ${totalBudget.monthlyBudget}원 / ${totalBudget.remainingBudget}원</span>`;
        emailContent += `<h4>💸 총 일별 추천 예산 / 일별 사용 가능 예산</h4>`;
        emailContent += `<span>- ${totalBudget.recommendExpenseAmount}원 / ${totalBudget.availableExpenseAmount}원</span>`;
        emailContent += `<br>`;
        emailContent += `<span style="background-color: rgba(157,189,255,0.8); border-radius: 10px; padding: 4px;">${totalBudget.message}</span>`;
        emailContent += `<br>`;

        categoryBudget.map((category) => {
          emailContent += `<h3>🏷️ ${category.categoryName} 지출 현황</h3>`;
          emailContent += `<h4>🗓️ ${category.categoryName} 월별 예산 / 남은 예산</h4>`;
          emailContent += `<span>- ${category.monthlyBudget}원 / ${category.remainingBudget}원</span>`;
          emailContent += `<h4>💸 ${category.categoryName} 일별 추천 예산 / 일별 사용 가능 예산</h4>`;
          emailContent += `<span>- ${category.recommendExpenseAmount}원 / ${category.availableExpenseAmount}원</span>`;
          emailContent += `<br>`;
          emailContent += `<span style="background-color: rgba(255,157,182,0.8); border-radius: 10px; padding: 4px;">${category.message}</span>`;
          emailContent += `<br>`;
        });

        promises.push(
          this.mailerService.sendMail({
            to: user.email,
            subject: `[돈이 Money 알림] ${user.username}님의 총 지출 현황`,
            html: emailContent,
          }),
        );
      });

      await Promise.all(promises);
      return;
    } else {
      const { totalBudget, categoryBudget } = await this.getMonthlyExpenses(id);

      return {
        totalBudget,
        categoryBudget,
      };
    }
  }

  /** 오늘 지출 안내 반환
   * @param id 지출 ID */
  @Cron('0 20 * * *')
  async selectTodayExpense(id: number) {
    if (!id) {
      const users = await this.userLib.getUsers(`isExpenseNotified`);
      const promises = [];

      users.map(async (user) => {
        const { totalTodayExpenseAmount, recommendExpenseRatios } =
          await this.getDailyExpenses(user.id);

        let emailContent = `<h3>💼 오늘 지출 현황</h3>`;
        emailContent += `<h4>💸 금일 지출</h4>`;
        emailContent += `<span>- ${totalTodayExpenseAmount}원</span>`;
        emailContent += `<br>`;

        recommendExpenseRatios.map((category) => {
          emailContent += `<h3>🏷️ ${category.categoryName} 지출 현황</h3>`;
          emailContent += `<h4>💸 ${category.categoryName} 추천 금일 지출 / 금일 사용 지출</h4>`;
          emailContent += `<span>- ${category.recommendExpenseAmount}원 / ${category.todayExpenseAmount}원</span>`;
          emailContent += `<br>`;
          emailContent += `<span style="background-color: rgba(255,157,182,0.8); border-radius: 10px; padding: 4px;">위험도: ${category.ratio}%</span>`;
          emailContent += `<br>`;
        });

        promises.push(
          this.mailerService.sendMail({
            to: user.email,
            subject: `[돈이 Money 알림] ${user.username}님의 금일 지출 현황`,
            html: emailContent,
          }),
        );
      });

      await Promise.all(promises);
      return;
    } else {
      const { totalTodayExpenseAmount, recommendExpenseRatios } =
        await this.getDailyExpenses(id);

      return {
        totalTodayExpenseAmount,
        recommendExpenseRatios,
      };
    }
  }

  /** 사용자 인증 정보 확인
   * @param id 사용자 생성 ID
   * @param userID 사용자 ID */
  private async checkAuthorization(id: number, userID: number) {
    const expense = await this.expenseLib.getExpenseByID(id);
    if (Number(expense.userID) !== userID) {
      throw new UnauthorizedException(ErrorType.USER_UNAUTHORIZED);
    }

    return expense;
  }

  /** 지출 합계 반환
   * @param expenses 지출 목록 */
  private getTotalAmount(expenses: any) {
    return expenses.reduce(
      (total: number, expense: any) =>
        total + Number(expense.isExclude ? 0 : expense.amount),
      0,
    );
  }

  /** 지출 카테고리 별 합계 반환
   * @param expenses 지출 목록 */
  private getCategoryAmounts(expenses: Expense[]) {
    const categoryTotals: { [key: number]: number } = {};

    // 검색된 지출 데이터에서 카테고리 별 총액 계산
    expenses.forEach((expense: Expense) => {
      const categoryId = expense.category.id;
      const amount = expense.isExclude ? 0 : Number(expense.amount);

      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += amount;
    });

    return Promise.all(
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
  }

  /** 월별 지출과 카테고리 별 지출 반환
   * @param id 사용자 생성 ID */
  private async getMonthlyExpenses(id: number) {
    const monthlyBudget = await this.budgetLib.getBudgetsByUser(id);
    const monthlyTotalBudget = monthlyBudget.reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    );

    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );
    const monthBegin = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0),
    );
    const monthEnd = new Date(
      Date.UTC(today.getFullYear(), today.getMonth() + 1, 1, 0, 0, 0),
    );
    const monthlyDays = Math.floor(
      (monthEnd.getTime() - monthBegin.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysUntilEnd = Math.floor(
      (monthEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const userExpenses = await this.expenseLib.getExpenses(id, {
      beginDate: monthBegin,
      endDate: todayMidnight,
    });

    const totalExpenseAmount = this.getTotalAmount(userExpenses);
    const categoryExpenseAmounts = await this.getCategoryAmounts(userExpenses);

    const totalRemainingBudget = monthlyTotalBudget - totalExpenseAmount;

    const monthAvailableExpenseAmount =
      Math.floor(monthlyTotalBudget / monthlyDays / 100) * 100;
    const todayAvailableExpenseAmount =
      Math.floor(
        (totalRemainingBudget > 0 ? totalRemainingBudget : 0) /
          daysUntilEnd /
          100,
      ) * 100;

    const totalBudget = {
      monthlyBudget: monthlyTotalBudget,
      remainingBudget: totalRemainingBudget,
      recommendExpenseAmount: monthAvailableExpenseAmount,
      availableExpenseAmount:
        todayAvailableExpenseAmount > 0
          ? todayAvailableExpenseAmount
          : monthAvailableExpenseAmount,
      message:
        monthAvailableExpenseAmount > todayAvailableExpenseAmount
          ? '🥺 추천 지출 금액을 초과하였어요. 절약해주세요!'
          : '😊 절약을 잘 실천하고 계세요! 오늘도 절약 도전!',
    };

    const categoryBudget = [];
    for (const budget of monthlyBudget) {
      const expenseMatch = categoryExpenseAmounts.find(
        (expense) => expense.categoryID === budget.category.id,
      );

      const remainingBudget = expenseMatch
        ? Number(budget.amount) - expenseMatch.amount
        : Number(budget.amount);
      const recommendExpenseAmount =
        Math.floor(budget.amount / monthlyDays / 100) * 100;
      const availableExpenseAmount =
        Math.floor(remainingBudget / daysUntilEnd / 100) * 100;

      categoryBudget.push({
        categoryID: budget.category.id,
        categoryName: (await this.categoryLib.getCategory(budget.category.id))
          .type,
        monthlyBudget: Number(budget.amount),
        remainingBudget: remainingBudget,
        recommendExpenseAmount: recommendExpenseAmount,
        availableExpenseAmount:
          availableExpenseAmount > 0
            ? availableExpenseAmount
            : recommendExpenseAmount,
        message:
          recommendExpenseAmount > availableExpenseAmount
            ? '🥺 추천 지출 금액을 초과하였어요. 절약해주세요!'
            : '😊 절약을 잘 실천하고 계세요! 오늘도 절약 도전!',
      });
    }

    for (const expense of categoryExpenseAmounts) {
      const budgetMatch = monthlyBudget.find(
        (budget) => expense.categoryID === budget.category.id,
      );

      if (!budgetMatch) {
        categoryBudget.push({
          categoryID: expense.categoryID,
          categoryName: expense.categoryName,
          monthlyBudget: 0,
          remainingBudget: 0 - Number(expense.amount),
          recommendExpenseAmount: 0,
          availableExpenseAmount: 10000,
          message: '🥺 추천 지출 금액을 초과하였어요. 절약해주세요!',
        });
      }
    }

    return {
      totalBudget,
      categoryBudget,
    };
  }

  private async getDailyExpenses(id: number) {
    const { categoryBudget } = await this.getMonthlyExpenses(id);

    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );

    const userExpenses = await this.expenseLib.getExpenses(id, {
      beginDate: todayMidnight,
      endDate: now,
    });

    // 카테고리 별 지출로 표현
    const categorySumObject = userExpenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      const categoryId = category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = { categoryID: categoryId, todayExpenseAmount: 0 };
      }

      acc[categoryId].todayExpenseAmount += Number(amount);

      return acc;
    }, {});
    const categorySum = Object.values(categorySumObject).map(
      ({ categoryID, todayExpenseAmount }) => ({
        categoryID,
        todayExpenseAmount,
      }),
    );

    const totalTodayExpenseAmount = categorySum.reduce(
      (total, { todayExpenseAmount }) => {
        return total + todayExpenseAmount;
      },
      0,
    );

    const recommendExpenseRatios = [];
    for (const { categoryID, todayExpenseAmount } of categorySum) {
      const budget = categoryBudget.find(
        (budget) => budget.categoryID === categoryID,
      );
      let recommendExpenseAmount = 0;
      if (budget) {
        recommendExpenseAmount = budget.recommendExpenseAmount;
      }

      const categoryName = (await this.categoryLib.getCategory(categoryID))
        .type;

      const ratio =
        recommendExpenseAmount !== 0
          ? Math.round((todayExpenseAmount / recommendExpenseAmount) * 100)
          : todayExpenseAmount;

      recommendExpenseRatios.push({
        categoryID,
        categoryName,
        recommendExpenseAmount,
        todayExpenseAmount,
        ratio,
      });
    }

    return {
      totalTodayExpenseAmount,
      recommendExpenseRatios,
    };
  }
}
