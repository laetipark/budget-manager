import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { SignInUserDto } from './dto/signInUser.dto';
import { ErrorType } from '../../enum/errorType.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /** 사용자 생성
   * @Param username 사용자 계정이름
   * @Param password 사용자 비밀번호, 해시 함수를 적용하고 저장 */
  async createUser({ username, password }) {
    return await this.userRepository.save(
      this.userRepository.create({
        username,
        password,
      }),
    );
  }

  /** 비밀번호 유효성 검사
   * @Param password 사용자 비밀번호
   * @Param confirmPassword 사용자 비밀번호 확인 */
  async checkPasswordValidate(password: string, confirmPassword: string) {
    const characterTypes = [
      /[a-zA-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*]/.test(password),
    ].filter(Boolean).length;
    if (characterTypes < 2) {
      throw new BadRequestException(ErrorType.PASSWORD_CHARACTER_REQUIRE);
    }

    if (/([!@#$%^&*()+\-=\[\]{}|;:'",.<>/?\w])\1\1/.test(password)) {
      throw new BadRequestException(ErrorType.PASSWORD_DISALLOW_CONSECUTIVE);
    }

    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
    const isValidPassword = await this.comparePassword(
      password,
      hashedConfirmPassword,
    );
    if (!isValidPassword) {
      throw new ConflictException(ErrorType.CONFIRM_PASSWORD_MISMATCH);
    }
  }

  /** 중복된 사용자 여부 확인
   * @Param username 사용자 계정이름 */
  async checkUserExists(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new ConflictException(ErrorType.USERNAME_EXIST);
    }
  }

  /**
   * 사용자 검증
   * @return 검증된 User 객체
   * @param signInUserDto LoginDto
   */
  async verifyUser(signInUserDto: SignInUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({
      username: signInUserDto.username,
    });
    if (!user) {
      throw new UnauthorizedException(ErrorType.USERNAME_NOT_EXIST);
    }

    const isMatch = await this.comparePassword(
      signInUserDto.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException(ErrorType.PASSWORD_MISMATCH);
    }

    return user;
  }

  /** JWT Access Token 발급
   * @param payload payload 요소 */
  async getAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  /** 평문과 암호문 비교
   * @param plainPassword 평문
   * @param hashedPassword 암호문 */
  private comparePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
