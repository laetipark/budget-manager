import { IsString } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class CreateCategoryDto {
  @IsString({ message: ErrorType.CATEGORY_NAME_NOT_EXIST })
  type!: string;
}
