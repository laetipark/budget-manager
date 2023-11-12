import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';

@Injectable()
export class UserLib {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * id로 사용자 조회
   * @param id 사용자 DB ID
   * @return User 객체
   */
  getUserById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * id의 사용자 정보 업데이트
   * @param id 사용자 DB ID
   * @param updateUserDto 사용자 업데이트 정보
   * @return User 업데이트 정보
   */
  async updateUser(
    id: number,
    updateUserDto: {
      password: string;
      isRecommendNotified: boolean;
      isExpenseNotified: boolean;
    },
  ) {
    return this.userRepository.update(id, updateUserDto);
  }
}
