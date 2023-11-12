import { IsBoolean, IsString, MinLength } from 'class-validator';
import { ErrorType } from '../../../enum/errorType.enum';

export class UpdateUserDto {
  @IsString()
  @MinLength(10, { message: ErrorType.PASSWORD_LENGTH_REQUIRE })
  password!: string;

  @IsString()
  previousPassword!: string;

  @IsString()
  confirmPassword!: string;

  @IsBoolean({ message: ErrorType.USER_UPDATE_BAD_REQUEST })
  isRecommendNotified!: boolean;

  @IsBoolean({ message: ErrorType.USER_UPDATE_BAD_REQUEST })
  isExpenseNotified!: boolean;
}
