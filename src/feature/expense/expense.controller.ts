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
import { SuccessType } from '../../enum/successType.enum';
import { BodyExpenseDto } from './dto/bodyExpense.dto';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';
import { SelectExpensesRequestDto } from './dto/selectExpensesRequest.dto';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

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
      message: SuccessType.USER_GET,
      data: expenses,
    };
  }

  @Get('/:id')
  async getExpense(@Param('id') id: number, @Req() req: any) {
    const expense = await this.expenseService.selectExpense(id, req.user.id);
    return {
      message: SuccessType.USER_GET,
      data: expense,
    };
  }

  @Post('/')
  async postExpense(@Body() bodyExpenseDto: BodyExpenseDto, @Req() req: any) {
    await this.expenseService.insertExpense(req.user.id, bodyExpenseDto);

    return {
      message: SuccessType.USER_GET,
      data: bodyExpenseDto,
    };
  }

  @Patch('/:id')
  async patchExpense(
    @Param('id') id: number,
    @Body() bodyExpenseDto: BodyExpenseDto,
    @Req() req: any,
  ) {
    await this.expenseService.updateExpense(id, req.user.id, bodyExpenseDto);

    return {
      message: SuccessType.USER_GET,
      data: 'await this.categoryService.getCategories()',
    };
  }

  @Patch('/exclude/:id')
  async patchExpenseExclude(
    @Param('id') id: number,
    @Query('isExclude', ParseBoolPipe) isExclude: boolean,
    @Req() req: any,
  ) {
    await this.expenseService.updateExpenseExclude(id, req.user.id, isExclude);

    return {
      message: SuccessType.USER_GET,
      data: {
        isExclude,
      },
    };
  }

  @Delete('/:id')
  async deleteExpense(@Param('id') id: number, @Req() req: any) {
    await this.expenseService.deleteExpense(id, req.user.id);

    return {
      message: SuccessType.USER_GET,
      data: 'await this.categoryService.getCategories()',
    };
  }
}
