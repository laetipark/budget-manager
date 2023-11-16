import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  async getBudgetsByUsers(id: number, amount: number) /*: Promise<Budget[]>*/ {
    const users = await this.budgetRepository
      .createQueryBuilder('b')
      .select('b.user.id', 'userID')
      .addSelect(`ABS(SUM(b.amount) - :amount)`, 'diff')
      .setParameter('amount', amount)
      .where('b.user.id != :id', {
        id: id,
      })
      .orderBy('diff', 'ASC')
      .groupBy('b.user.id')
      .limit(10)
      .getRawMany();

    return await this.budgetRepository
      .createQueryBuilder('b')
      .select('u.id', 'userID')
      .addSelect('c.id', 'categoryID')
      .addSelect('b.amount', 'amount')
      .where('b.user.id IN (:ids)', {
        ids: users.map((item) => item.userID),
      })
      .leftJoin('b.user', 'u')
      .leftJoin('b.category', 'c')
      .getRawMany()
      .then((result) => {
        const groupedData = result.reduce((grouped, item) => {
          const { userID, categoryID, amount } = item;
          if (!grouped[userID]) {
            grouped[userID] = { userID, budgets: [] };
          }

          const categoryExists = grouped[userID].budgets.find(
            ({ categoryID: id }) => id === categoryID,
          );
          if (!categoryExists) {
            grouped[userID].budgets.push({
              categoryID,
              amount: Number(amount),
            });
          } else {
            categoryExists.amount += Number(amount);
          }

          return grouped;
        }, {});

        return Object.values(groupedData);
      });
  }
}
