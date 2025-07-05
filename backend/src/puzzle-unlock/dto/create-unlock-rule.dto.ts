import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UnlockRuleType } from '../entities/unlock-rule.entity';

export class CreateUnlockRuleDto {
  @IsString()
  @IsNotEmpty()
  targetPuzzleId: string;

  @ValidateIf((o) => o.type === 'PREREQUISITE')
  @IsString()
  @IsNotEmpty()
  prerequisitePuzzleId?: string;

  @IsEnum(UnlockRuleType)
  type: UnlockRuleType = UnlockRuleType.PREREQUISITE;

  @IsOptional()
  customCondition?: Record<string, any>;
}
