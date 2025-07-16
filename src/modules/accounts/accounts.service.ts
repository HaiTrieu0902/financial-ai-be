import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    // Check if account with same name exists for the user
    if (createAccountDto.userId) {
      const existingAccount = await this.accountsRepository.findOne({
        where: {
          name: createAccountDto.name,
          userId: createAccountDto.userId,
          isDeleted: false,
        },
      });
      if (existingAccount) {
        throw new ConflictException('Account with this name already exists for this user');
      }
    }

    const account = this.accountsRepository.create({
      ...createAccountDto,
      balance: createAccountDto.balance || 0,
      currency: createAccountDto.currency || 'VND',
    });

    return this.accountsRepository.save(account);
  }

  async findAll(userId?: string): Promise<Account[]> {
    const whereCondition: any = { isDeleted: false };

    if (userId) {
      whereCondition.userId = userId;
    }

    return this.accountsRepository.find({
      where: whereCondition,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.accountsRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id);

    // Check if name is being updated and conflicts with existing account
    if (updateAccountDto.name && updateAccountDto.name !== account.name) {
      const existingAccount = await this.accountsRepository.findOne({
        where: {
          name: updateAccountDto.name,
          userId: account.userId,
          isDeleted: false,
        },
      });
      if (existingAccount && existingAccount.id !== id) {
        throw new ConflictException('Account with this name already exists for this user');
      }
    }

    Object.assign(account, updateAccountDto);
    return this.accountsRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    account.isDeleted = true;
    await this.accountsRepository.save(account);
  }

  async updateBalance(id: string, newBalance: number, updatedBy?: string): Promise<Account> {
    const account = await this.findOne(id);
    account.balance = newBalance;
    if (updatedBy) {
      account.updatedBy = updatedBy;
    }
    return this.accountsRepository.save(account);
  }

  async getTotalBalance(userId: string, currency?: string): Promise<number> {
    const whereCondition: any = {
      userId,
      isDeleted: false,
    };

    if (currency) {
      whereCondition.currency = currency;
    }

    const result = await this.accountsRepository.createQueryBuilder('account').select('SUM(account.balance)', 'total').where(whereCondition).getRawOne();

    return parseFloat(result.total) || 0;
  }
}
