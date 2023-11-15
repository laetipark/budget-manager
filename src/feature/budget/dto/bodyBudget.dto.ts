import { IsNumber } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class BodyBudgetDto {
  @IsNumber()
  categoryID?: number;

  @IsNumber({}, { message: ErrorType.AMOUNT_NOT_EXIST })
  amount!: number;
}
