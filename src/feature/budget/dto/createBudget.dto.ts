import { IsNumber } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class CreateBudgetDto {
  @IsNumber({}, { message: ErrorType.USER_NOT_EXIST })
  user!: {
    id: number;
  };

  @IsNumber({}, { message: ErrorType.CATEGORY_NOT_EXIST })
  category!: {
    id: number;
  };

  @IsNumber({}, { message: ErrorType.AMOUNT_NOT_EXIST })
  amount!: number;
}
