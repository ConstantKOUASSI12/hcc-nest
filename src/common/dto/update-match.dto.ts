import { CreateMatchDto } from './create-match.dto';
import { ApiExtraModels,PartialType } from '@nestjs/swagger';


export class UpdateMatchDto extends PartialType(CreateMatchDto) {}

/* export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  score?: string;

  @IsBoolean()
  isFinished: boolean;

  @IsOptional()
  @IsString()
  comment? : string

} */
