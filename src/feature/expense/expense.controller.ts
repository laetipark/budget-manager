import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { SuccessType } from '../../interfaces/enum/successType.enum';
import { BodyExpenseDto } from './dto/bodyExpense.dto';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';
import { SelectExpensesRequestDto } from './dto/selectExpensesRequest.dto';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  /** 지출 목록 조회
   * @param selectExpensesDto 지출 조회 조건
   * @param req 현재 로그인 정보 */
  @Get('/')
  async getExpenses(
    @Body() selectExpensesDto: SelectExpensesRequestDto,
    @Req() req: any,
  ) {
    const expenses = await this.expenseService.selectExpenses(
      req.user.id,
      selectExpensesDto,
    );

    return {
      message: SuccessType.EXPENSE_GET,
      data: expenses,
    };
  }

  /** 오늘 지출 추천 조회
   * @param req 현재 로그인 정보 */
  @Get('/today/recommendation')
  async getRecommendExpense(@Req() req: any) {
    const recommendExpenses =
      await this.expenseService.selectExpenseRecommendation(req.user.id, true);

    return {
      message: SuccessType.EXPENSE_TODAY_RECOMMENDATION_GET,
      data: recommendExpenses,
    };
  }

  /** 오늘 지출 안내 조회
   * @param req 현재 로그인 정보 */
  @Get('/today/notification')
  async getTodayExpense(@Req() req: any) {
    const recommendExpenses = await this.expenseService.selectTodayExpense(
      req.user.id,
      true,
    );

    return {
      message: SuccessType.EXPENSE_TODAY_NOTIFICATION_GET,
      data: recommendExpenses,
    };
  }

  /** 지출 상세 조회
   * @param id 지출 ID
   * @param req 현재 로그인 정보 */
  @Get('/:id')
  async getExpense(@Param('id') id: number, @Req() req: any) {
    const expense = await this.expenseService.selectExpense(id, req.user.id);
    return {
      message: SuccessType.EXPENSE_DETAIL_GET,
      data: expense,
    };
  }

  /** 지출 정보 추가
   * @param bodyExpenseDto 추가 요청 지출 정보
   * @param req 현재 로그인 정보 */
  @Post('/')
  async postExpense(@Body() bodyExpenseDto: BodyExpenseDto, @Req() req: any) {
    await this.expenseService.insertExpense(req.user.id, bodyExpenseDto);

    return {
      message: SuccessType.EXPENSE_POST,
      data: bodyExpenseDto,
    };
  }

  /** 지출 정보 변경
   * @param id 지출 ID
   * @param bodyExpenseDto 변경 요청 지출 정보
   * @param req 현재 로그인 정보 */
  @Patch('/:id')
  async patchExpense(
    @Param('id') id: number,
    @Body() bodyExpenseDto: BodyExpenseDto,
    @Req() req: any,
  ) {
    await this.expenseService.updateExpense(id, req.user.id, bodyExpenseDto);

    return {
      message: SuccessType.EXPENSE_PATCH,
      data: 'await this.categoryService.getCategories()',
    };
  }

  /** 지출 합계 제외 정보 변경
   * @param id 지출 ID
   * @param isExclude 합계 제외 여부
   * @param req 현재 로그인 정보 */
  @Patch('/exclude/:id')
  async patchExpenseExclude(
    @Param('id') id: number,
    @Query('isExclude', ParseBoolPipe) isExclude: boolean,
    @Req() req: any,
  ) {
    await this.expenseService.updateExpenseExclude(id, req.user.id, isExclude);

    return {
      message: SuccessType.EXPENSE_EXCLUDE_PATCH,
      data: {
        isExclude,
      },
    };
  }

  /** 지출 정보 삭제
   * @param id 지출 ID
   * @param req 현재 로그인 정보 */
  @Delete('/:id')
  async deleteExpense(@Param('id') id: number, @Req() req: any) {
    await this.expenseService.deleteExpense(id, req.user.id);

    return {
      message: SuccessType.EXPENSE_DELETE,
      data: 'await this.categoryService.getCategories()',
    };
  }
}
