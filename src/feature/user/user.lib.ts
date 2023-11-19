import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../../entity/user.entity';
import { ErrorType } from '../../interfaces/enum/errorType.enum';

@Injectable()
export class UserLib {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 전체 사용자 조회 데이터 반환
   * @return Promise<User[]>
   */
  getUsers(column: string): Promise<User[]> {
    const query: any = {
      where: {},
    };
    if (column === 'isRecommendNotified') {
      query.where.isRecommendNotified = true;
    } else if (column === 'isExpenseNotified') {
      query.where.isExpenseNotified = true;
    }

    return this.userRepository.find(query);
  }

  /**
   * id로 사용자 조회 데이터 반환
   * @param id 사용자 DB ID
   * @return Promise<User>
   */
  async getUserByID(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(ErrorType.USER_NOT_EXIST);
    }

    return user;
  }

  /**
   * id의 사용자 정보 변경
   * @param id 사용자 DB ID
   * @param updateUserDto 사용자 업데이트 정보
   * @return Promise<UpdateResult>
   */
  async updateUser(
    id: number,
    updateUserDto: {
      password: string;
      email: string;
      isRecommendNotified: boolean;
      isExpenseNotified: boolean;
    },
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }
}
