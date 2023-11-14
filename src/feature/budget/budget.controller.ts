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

  @Get('/')
  async getBudget(@Req() req: any) {
    const budget = await this.budgetService.selectBudgets(req.user.id);

    return {
      message: SuccessType.BUDGET_GET,
      data: budget,
    };
  }

  @Post('/')
  async postBudget(@Body() bodyBudgetDto: BodyBudgetDto[], @Req() req: any) {
    await this.budgetService.budgetExists(req.user.id);
    await this.budgetService.insertBudget(req.user.id, bodyBudgetDto);

    return {
      message: SuccessType.BUDGET_POST,
      data: bodyBudgetDto,
    };
  }

  @Patch('/')
  async patchBudget(@Body() bodyBudgetDto: BodyBudgetDto[], @Req() req: any) {
    await this.budgetService.upsertBudget(req.user.id, bodyBudgetDto);

    return {
      message: SuccessType.BUDGET_PATCH,
      data: bodyBudgetDto,
    };
  }

  @Get('/recommendation')
  async getRecommendBudget(@Query('amount') amount: number, @Req() req: any) {
    await this.budgetService.budgetExists(req.user.id);
    const categoryRatios = await this.budgetService.calculateCategoryRatios();
    const recommendedBudgets = await this.budgetService.getRecommendBudget(
      amount,
      categoryRatios,
    );

    return {
      message: SuccessType.BUDGET_RECOMMENDATION_GET,
      data: recommendedBudgets,
    };
  }
}
