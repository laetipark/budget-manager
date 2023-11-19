import { IsEmail, IsString, MinLength } from 'class-validator';
import { ErrorType } from '../../../interfaces/enum/errorType.enum';

export class SignUpUserDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(10, { message: ErrorType.PASSWORD_LENGTH_REQUIRE })
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsEmail({}, { message: ErrorType.EMAIL_NOT_VALID })
  email!: string;
}
