import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetLib } from './budget.lib';
import { UserLib } from '../user/user.lib';
import { CategoryLib } from '../category/category.lib';
import { Budget } from '../../entity/budget.entity';
import { CreateBudgetDto } from './dto/createBudget.dto';
import { BodyBudgetDto } from './dto/bodyBudget.dto';
import { ErrorType } from '../../interfaces/enum/errorType.enum';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly budgetLib: BudgetLib,
    private readonly userLib: UserLib,
    private readonly categoryLib: CategoryLib,
  ) {}

  /** 사용자 예산 정보 반환
   * @Param id 사용자 생성 ID */
  async selectBudgets(id: number) {
    const budgets = await this.budgetLib.getBudgetsByUser(id);
    if (budgets.length < 1) {
      throw new NotFoundException(ErrorType.BUDGETS_NOT_EXIST);
    }

    return budgets.map((item) => {
      return {
        categoryID: item.category.id,
        amount: item.amount,
      };
    });
  }

  /** 사용자 예산 중복 추가 여부 확인
   * @Param id 사용자 생성 ID */
  async budgetExists(id: number) {
    const userBudgets = await this.budgetLib.getBudgetsByUser(id);

    if (userBudgets.length > 0) {
      throw new BadRequestException(ErrorType.BUDGET_EXIST);
    }
  }

  /** 사용자 예산 정보 추가
   * @Param id 사용자 생성 ID
   * @param bodyBudgetDto 추가 요청 예산 정보
   * @return Budget[] */
  async insertBudget(id: number, bodyBudgetDto: BodyBudgetDto[]) {
    const budgets = await this.getNewBudgets(id, bodyBudgetDto);

    return await this.budgetRepository.save(
      this.budgetRepository.create(budgets),
    );
  }

  /** 사용자 예산 정보 변경 및 추가
   * @Param id 사용자 생성 ID
   * @param bodyBudgetDto 변경 요청 예산 정보 */
  async upsertBudget(id: number, bodyBudgetDto: BodyBudgetDto[]) {
    const existingBudgets = await this.budgetLib.getBudgetsByUser(id);
    const updateBudgets = await this.getNewBudgets(id, bodyBudgetDto);
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

  /** 사용자 예산 총액 주변의 다른 유저들 예산 분배 목록 반환
   * @param id 사용자 생성 ID
   * @param amount 예산 총액 */
  async selectBudgetRecommend(id: number, amount: number) {
    return await this.budgetLib.getBudgetsByUsers(id, amount);
  }

  /** 테이블 형태의 예산 정보로 변환
   * @Param id 사용자 생성 ID
   * @Param bodyBudgetDto 요청 예산 정보 */
  private async getNewBudgets(
    id: number,
    bodyBudgetDto: BodyBudgetDto[],
  ): Promise<CreateBudgetDto[]> {
    // 요청 예산 정보에 중복된 키 여부 확인
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
        const user = await this.userLib.getUserByID(id);
        const category = await this.categoryLib.getCategory(item.categoryID);
        if (!user) {
          throw new NotFoundException(ErrorType.USER_NOT_EXIST);
        }
        if (!category) {
          throw new NotFoundException(ErrorType.CATEGORY_NOT_EXIST);
        }

        return {
          user: { id: id },
          category: { id: item.categoryID },
          amount: item.amount,
        };
      }),
    );
  }
}
