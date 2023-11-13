import { IsNumber, IsObject } from 'class-validator';
import { User } from '../../../entity/user.entity';
import { Category } from '../../../entity/category.entity';

export class CreateBudgetDto {
  @IsObject()
  user!: User;

  @IsObject()
  category?: Category;

  @IsNumber()
  amount!: number;
}
