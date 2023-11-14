import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Budget } from '../../entity/budget.entity';

@Injectable()
export class BudgetLib {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  /** id의 사용자 예산 정보 반환
   * @return Budget[]
   */
  getBudgetsByUser(id: number): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { user: { id: id } },
      relations: ['user', 'category'],
    });
  }

  /** 전체 사용자들의 예산 정보 반환
   * @return Budget[]
   */
  getBudgetsByUsers(ids: number[]): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: {
        user: In(ids),
      },
      relations: ['category'],
    });
  }
}
