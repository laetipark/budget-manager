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

  /** budget 반환
   * @return Budget[]
   */
  getBudgetsByUser(id: number): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { user: { id: id } },
      relations: ['user', 'category'],
    });
  }

  getBudgetsByUsers(ids: number[]): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: {
        user: In(ids),
      },
      relations: ['category'],
    });
  }
}
