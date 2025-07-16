import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AccountsService } from './accounts.service';
import { AccountResponseDto } from './dto/account-response.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@ApiTags('accounts')
@Controller('accounts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully', type: AccountResponseDto })
  @ApiResponse({ status: 409, description: 'Account with this name already exists' })
  async create(@Body() createAccountDto: CreateAccountDto, @CurrentUser() user: User): Promise<Account> {
    // If no userId is provided, use the current user's ID
    if (!createAccountDto.userId) {
      createAccountDto.userId = user.id;
    }

    // Set created_by to current user
    createAccountDto.createdBy = user.id;

    return this.accountsService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully', type: [AccountResponseDto] })
  async findAll(@Query('userId') userId?: string): Promise<Account[]> {
    return this.accountsService.findAll(userId);
  }

  @Get('my-accounts')
  @ApiOperation({ summary: 'Get current user accounts' })
  @ApiResponse({ status: 200, description: 'User accounts retrieved successfully', type: [AccountResponseDto] })
  async getMyAccounts(@CurrentUser() user: User): Promise<Account[]> {
    return this.accountsService.findByUserId(user.id);
  }

  @Get('total-balance')
  @ApiOperation({ summary: 'Get total balance for current user' })
  @ApiQuery({ name: 'currency', required: false, description: 'Filter by currency' })
  @ApiResponse({ status: 200, description: 'Total balance retrieved successfully' })
  async getTotalBalance(@CurrentUser() user: User, @Query('currency') currency?: string): Promise<{ totalBalance: number; currency?: string }> {
    const totalBalance = await this.accountsService.getTotalBalance(user.id, currency);
    return { totalBalance, ...(currency && { currency }) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Account retrieved successfully', type: AccountResponseDto })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(@Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiResponse({ status: 200, description: 'Account updated successfully', type: AccountResponseDto })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 409, description: 'Account with this name already exists' })
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @CurrentUser() user: User): Promise<Account> {
    // Set updated_by to current user
    updateAccountDto.updatedBy = user.id;

    return this.accountsService.update(id, updateAccountDto);
  }

  @Patch(':id/balance')
  @ApiOperation({ summary: 'Update account balance' })
  @ApiResponse({ status: 200, description: 'Account balance updated successfully', type: AccountResponseDto })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async updateBalance(@Param('id') id: string, @Body() body: { balance: number }, @CurrentUser() user: User): Promise<Account> {
    return this.accountsService.updateBalance(id, body.balance, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account (soft delete)' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.accountsService.remove(id);
    return { message: 'Account deleted successfully' };
  }
}
