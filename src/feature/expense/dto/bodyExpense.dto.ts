import { IsDateString, IsNumber, IsString } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class BodyExpenseDto {
  @IsNumber({}, { message: ErrorType.CATEGORY_NOT_EXIST })
  categoryID!: number;

  @IsDateString({}, { message: ErrorType.DATE_NOT_EXIST })
  date!: Date;

  @IsNumber({}, { message: ErrorType.AMOUNT_NOT_EXIST })
  amount!: number;

  @IsString({ message: ErrorType.LOCATION_NOT_EXIST })
  location!: string;

  @IsString({ message: ErrorType.CONTENT_NOT_EXIST })
  content!: string;
}
