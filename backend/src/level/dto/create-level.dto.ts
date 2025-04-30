import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LevelEnum } from 'src/enums/LevelEnum';

export class CreateLevelDto {
  @ApiProperty({ description: 'The name of the level' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the level' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The level type', enum: LevelEnum })
  @IsEnum(LevelEnum)
  @IsNotEmpty()
  level: LevelEnum;

  @ApiProperty({ description: 'The required score to unlock this level' })
  @IsNumber()
  @IsOptional()
  requiredScore?: number;

  @ApiProperty({ description: 'Whether the level is locked' })
  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}