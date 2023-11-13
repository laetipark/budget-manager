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
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';
import { SuccessType } from '../../enum/successType.enum';

@UseGuards(JwtAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('/')
  async insertBudget(@Body() bodyBudgetDto: BodyBudgetDto[], @Req() req: any) {
    await this.budgetService.budgetExists(req.user.id);
    await this.budgetService.insertBudget(req.user.id, bodyBudgetDto);

    return {
      message: SuccessType.BUDGET_POST,
      data: bodyBudgetDto,
    };
  }

  @Patch('/')
  async updateBudget(@Body() bodyBudgetDto: BodyBudgetDto[], @Req() req: any) {
    await this.budgetService.upsertBudget(req.user.id, bodyBudgetDto);

    return {
      message: SuccessType.BUDGET_PATCH,
      data: bodyBudgetDto,
    };
  }

  @Get('/recommendation')
  async addBudgetRecommendation(
    @Query('amount') amount: number,
    @Req() req: any,
  ) {
    await this.budgetService.budgetExists(req.user.id);
    const categoryRatios = await this.budgetService.calculateCategoryRatios();
    const recommendedBudgets = await this.budgetService.recommendBudget(
      amount,
      categoryRatios,
    );

    return {
      message: SuccessType.BUDGET_RECOMMENDATION_GET,
      data: recommendedBudgets,
    };
  }
}
