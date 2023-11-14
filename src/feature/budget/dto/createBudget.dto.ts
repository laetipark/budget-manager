import { IsNumber, IsObject } from 'class-validator';

export class CreateBudgetDto {
  @IsObject()
  user!: {
    id: number;
  };

  @IsObject()
  category!: {
    id: number;
  };

  @IsNumber()
  amount!: number;
}
