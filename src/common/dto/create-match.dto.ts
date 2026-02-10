import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateMatchDto {

  @ApiProperty({
      description: 'La Date du match au format ISO (YYYY-MM-DD)',
      example: "2026-01-26"
  })
  @IsDateString({}, { message: 'La date doit être une date ISO valide (YYYY-MM-DD).',})
  @IsNotEmpty()
  date: string;


  @ApiProperty({
      description: 'L’heure doit être au format HH:mm',
      example: "18:30"
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'L’heure doit être au format HH:mm (ex: 18:30)',
  })
  time: string;


  @ApiProperty({
      description: "Nom de l'équipe adverse",
      example : "US Roubaix"
  })
  @IsNotEmpty()
  opponent: string;


  @ApiProperty({
      description: 'Lieu du match',
      example: "Salle Omnisports de Comines"
  })
  @IsNotEmpty()
  location: string;


  @ApiProperty({
      description: 'Le score final.NB:A la création du match le score est null',
      example: null
  })
  @IsString()
  @IsOptional()
  score?: string;

  @ApiProperty({
      description: 'Commentaire du match',
      example : null
  })
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty({
      description: 'Indiquer si le match est terminé',
      example : false
  })
  @IsOptional()
  isFinished: boolean

}
