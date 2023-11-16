import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Expense } from '../../entity/expense.entity';
import { BodyExpenseDto } from './dto/bodyExpense.dto';
import { SelectExpensesRequestDto } from './dto/selectExpensesRequest.dto';
import { SelectExpensesResponseDto } from './dto/selectExpensesResponse.dto';

@Injectable()
export class ExpenseLib {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  /**
   * 지출 목록 반환
   * @return Promise<Expense[]>
   */
  async getExpenses(
    id: number,
    selectExpenseDateDto: SelectExpensesRequestDto,
  ) {
    const query: any = {
      where: {
        user: { id: id },
        date: Between(
          selectExpenseDateDto.beginDate,
          selectExpenseDateDto.endDate,
        ),
      },
      relations: ['user', 'category'],
    };

    if (selectExpenseDateDto.categoryID) {
      query.where.category = { id: selectExpenseDateDto.categoryID };
    }
    if (selectExpenseDateDto.minAmount && selectExpenseDateDto.maxAmount) {
      query.where.amount = Between(
        selectExpenseDateDto.minAmount,
        selectExpenseDateDto.maxAmount,
      );
    } else if (selectExpenseDateDto.minAmount) {
      query.where.amount = MoreThanOrEqual(selectExpenseDateDto.minAmount);
    } else if (selectExpenseDateDto.maxAmount) {
      query.where.amount = LessThanOrEqual(selectExpenseDateDto.maxAmount);
    }

    return await this.expenseRepository.find(query);
  }

  /**
   * id로 지출 조회
   * @param id 사용자 DB ID
   * @return Promise<Expense>
   */
  async getExpenseByID(id: number): Promise<SelectExpensesResponseDto> {
    const expense: any = await this.expenseRepository
      .createQueryBuilder('e')
      .select('e.date', 'date')
      .addSelect('e.amount', 'amount')
      .addSelect('e.location', 'location')
      .addSelect('e.content', 'content')
      .addSelect('c.id', 'categoryID')
      .addSelect('c.type', 'categoryName')
      .addSelect('u.id', 'userID')
      .where('e.id = :id', { id })
      .leftJoin('e.user', 'u')
      .leftJoin('e.category', 'c')
      .getRawOne();

    return {
      date: expense.date,
      amount: parseInt(expense.amount),
      location: expense.location,
      content: expense.content,
      userID: parseInt(expense.userID),
      categoryID: parseInt(expense.categoryID),
      categoryName: expense.categoryName,
    };
  }

  /** id로 지출 정보 변경
   * @param id 지출 ID
   * @param bodyExpenseDto 추가 요청 지출 정보 */
  patchExpense(id: number, bodyExpenseDto: BodyExpenseDto) {
    return this.expenseRepository.update(id, {
      category: {
        id: bodyExpenseDto.categoryID,
      },
      date: bodyExpenseDto.date,
      amount: bodyExpenseDto.amount,
      location: bodyExpenseDto.location,
      content: bodyExpenseDto.content,
    });
  }

  /** 지출 합계 제외 정보 변경
   * @param id 지출 ID
   * @param isExclude 합계 제외 여부 */
  patchExpenseExclude(id: number, isExclude: boolean) {
    return this.expenseRepository.update(id, {
      isExclude: isExclude,
    });
  }

  /** 지출 정보 삭제
   * @param id 지출 ID */
  deleteExpense(id: number) {
    return this.expenseRepository.delete(id);
  }
}
