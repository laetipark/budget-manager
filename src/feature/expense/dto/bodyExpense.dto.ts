import { IsDateString, IsNumber, IsString } from 'class-validator';

export class BodyExpenseDto {
  @IsNumber()
  categoryID!: number;

  @IsDateString()
  date!: Date;

  @IsNumber()
  amount!: number;

  @IsString()
  location!: string;

  @IsString()
  content!: string;
}
