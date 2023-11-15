import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { SuccessType } from '../../interfaces/enum/successType.enum';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 사용자 정보 조회
   * @param req 현재 로그인 정보 */
  @Get('/me')
  async getUserInfo(@Req() req: any) {
    const { id, username, isRecommendNotified, isExpenseNotified } =
      await this.userService.getUserInfo(req.user.id);
    return {
      message: SuccessType.USER_GET,
      data: { id, username, isRecommendNotified, isExpenseNotified },
    };
  }

  /** 사용자 정보 변경
   * @param updateUserDto 업데이트 정보
   * @param req 현재 로그인 정보 */
  @Patch('/')
  async patchUser(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    await this.userService.updateUser(req.user.id, updateUserDto);
    return {
      message: SuccessType.USER_PATCH,
      data: {
        id: req.user.id,
        isRecommendNotified: updateUserDto.isRecommendNotified,
        isExpenseNotified: updateUserDto.isExpenseNotified,
      },
    };
  }
}
