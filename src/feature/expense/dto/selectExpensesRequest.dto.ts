import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class SelectExpensesRequestDto {
  @IsNumber()
  @IsOptional()
  minAmount?: number;

  @IsNumber()
  @IsOptional()
  maxAmount?: number;

  @IsNumber()
  @IsOptional()
  categoryID?: number;

  @IsDateString({}, { message: ErrorType.DATE_NOT_EXIST })
  beginDate!: Date;

  @IsDateString({}, { message: ErrorType.DATE_NOT_EXIST })
  endDate!: Date;
}
