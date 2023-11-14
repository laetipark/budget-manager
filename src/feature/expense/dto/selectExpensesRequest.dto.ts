import { IsDateString, IsNumber, IsOptional } from 'class-validator';

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

  @IsDateString()
  beginDate!: Date;

  @IsDateString()
  endDate!: Date;
}
