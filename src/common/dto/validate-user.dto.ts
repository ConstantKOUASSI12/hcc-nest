import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class ValidateUser {
  @ApiProperty({
      description: "Identifiant unique de l'adhérent à valider",
      example:2
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
      description: "Identifiant du role, {ADMIN:1,COACH:2,CONTRIBUTOR:3,PLAYER:4}",
      example:2
  })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}