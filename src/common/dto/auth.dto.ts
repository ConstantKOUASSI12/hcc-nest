import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthDto {

  @ApiProperty({
    description: "Email de l'adhérent",
    example:"kouassiconstant94@gmail.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @ApiProperty({
    description: "Password de l'adhérent",
    example:"1234567890"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  password: string;

}