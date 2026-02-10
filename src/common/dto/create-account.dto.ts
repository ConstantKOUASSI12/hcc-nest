import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateAccountDto {

  @ApiProperty({
    description: "Prénom de l'adhérent",
    example:"Jean-Dupont"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Le lastname doit contenir au moins 5 caractères' })
  @MaxLength(100, { message: 'Le lastname ne peut pas dépasser 100 caractères' })
  lastname: string;


  @ApiProperty({
    description: "Nom de famille de l'adhérent",
    example:"Abaad"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Le lastname doit contenir au moins 5 caractères' })
  @MaxLength(100, { message: 'Le lastname ne peut pas dépasser 100 caractères' })
  firstname: string;

  @ApiProperty({
    description: "Email de l'adhérent",
    example:"Jean-Dupont@gmail.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Contact de l'adhérent",
    example:"0611274430"
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10, { message: 'Le Contact ne peut pas dépasser 10 caractères' })
  contact: string;

  @ApiProperty({
    description: "Password de l'adhérent",
    example:"1234567890"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  password: string;
}