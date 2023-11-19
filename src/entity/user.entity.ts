import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import { Expense } from './expense.entity';

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'username' })
  username: string;

  @Column({ type: 'varchar', length: 200, name: 'password' })
  password: string;

  @Column({ type: 'varchar', length: 200, name: 'email' })
  email: string;

  @Column({ default: false, name: 'is_recommend_notified' })
  isRecommendNotified: boolean;

  @Column({ default: false, name: 'is_expense_notified' })
  isExpenseNotified: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @BeforeInsert()
  @BeforeUpdate()
  private async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
