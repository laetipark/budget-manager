import { IsString, MinLength } from 'class-validator';
import { ErrorType } from '../../../enum/errorType.enum';

export class SignUpUserDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(10, { message: ErrorType.PASSWORD_LENGTH_REQUIRE })
  password!: string;

  @IsString()
  confirmPassword!: string;
}
