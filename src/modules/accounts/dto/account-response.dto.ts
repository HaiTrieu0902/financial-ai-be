import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  type: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  currency: string;

  @Exclude()
  isDeleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  createdBy: string;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  updatedBy: string;

  @ApiPropertyOptional()
  @Expose()
  user?: {
    id: string;
    username: string;
    fullname: string;
    email: string;
  };
}
