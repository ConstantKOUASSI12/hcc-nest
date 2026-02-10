import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateNewsDto {

  @ApiProperty({
    description: 'Titre de l’actualité',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @ApiProperty({
    description: 'Contenu de l’actualité',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  content: string;
}
