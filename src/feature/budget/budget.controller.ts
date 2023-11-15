import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BodyBudgetDto } from './dto/bodyBudget.dto';
import { SuccessType } from '../../interfaces/enum/successType.enum';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  /** 사용자 예산 정보 조회
   * @param req 현재 로그인 정보 */
  @Get('/')
  async getBudget(@Req() req: any) {
    const budget = await this.budgetService.selectBudgets(req.user.id);

    return {
      message: SuccessType.BUDGET_GET,
      data: budget,
    };
  }

  /** 사용자 예산 추천 설계 조회
   * @Query amount 예산 총액
   * @param req 현재 로그인 정보 */
  @Get('/recommendation')
  async getRecommendBudget(@Query('amount') amount: number, @Req() req: any) {
    const recommendedBudgets =
      await this.budgetService.selectBudgetRecommend(amount);

    return {
      message: SuccessType.BUDGET_RECOMMENDATION_GET,
      data: recommendedBudgets,
    };
  }

  /** 사용자 예산 정보 추가
   * @param bodyBudgetDto 추가 요청 예산 정보
   * @param req 현재 로그인 정보 */
  @Post('/')
  async postBudget(@Body() bodyBudgetDto: BodyBudgetDto[], @Req() req: any) {
    await this.budgetService.budgetExists(req.user.id);
    await this.budgetService.insertBudget(req.user.id, bodyBudgetDto);

    return {
      message: SuccessType.BUDGET_POST,
      data: bodyBudgetDto,
    };
  }

  /** 사용자 예산 정보 변경
   * @param bodyBudgetDto 변경 요청 예산 정보
   * @param req 현재 로그인 정보 */
  @Patch('/')
  async patchBudget(@Body() bodyBudgetDto: BodyBudgetDto[], @Req() req: any) {
    await this.budgetService.upsertBudget(req.user.id, bodyBudgetDto);

    return {
      message: SuccessType.BUDGET_PATCH,
      data: bodyBudgetDto,
    };
  }
}
