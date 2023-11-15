import { IsBoolean, IsString, MinLength } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class UpdateUserDto {
  @IsString()
  @MinLength(10, { message: ErrorType.PASSWORD_LENGTH_REQUIRE })
  password!: string;

  @IsString({ message: ErrorType.PASSWORD_PREVIOUS_NOT_EXIST })
  previousPassword!: string;

  @IsString()
  confirmPassword!: string;

  @IsBoolean({ message: ErrorType.USER_UPDATE_BAD_REQUEST })
  isRecommendNotified!: boolean;

  @IsBoolean({ message: ErrorType.USER_UPDATE_BAD_REQUEST })
  isExpenseNotified!: boolean;
}
