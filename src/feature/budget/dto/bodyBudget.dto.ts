import { IsNumber } from 'class-validator';

export class BodyBudgetDto {
  @IsNumber()
  categoryID?: number;

  @IsNumber()
  amount!: number;
}
