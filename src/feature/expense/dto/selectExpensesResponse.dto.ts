import { IsDateString, IsNumber, IsString } from 'class-validator';

export class SelectExpensesResponseDto {
  @IsDateString()
  date!: Date;

  @IsNumber()
  amount!: number;

  @IsString()
  location!: string;

  @IsString()
  content!: string;

  @IsNumber()
  userID!: number;

  @IsNumber()
  categoryID!: number;

  @IsString()
  categoryName!: string;
}
