import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { CreateAccountDto } from 'src/common/dto/create-account.dto';
import { AuthService } from './auth.service';
import type { User } from 'src/interfaces/user.interface';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from 'src/common/dto/auth.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @ApiOperation({ 
        summary: 'Création de compte'
    })
    @ApiResponse({ status: 200, description: 'Compte créé avec succès' })
    @ApiResponse({ status: 400, description: 'Mauvaise requête' })
    @ApiResponse({ status: 409, description: 'Contact ou email déjà utilisé' })
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Account successfully created')
    register(@Body() data: CreateAccountDto) : Promise<User> {
        return this.authService.register(data)
    }

    @ApiOperation({ 
        summary: 'Authentification'
    })
    @ApiResponse({ status: 202, description: "Informations d'identification valides" })
    @ApiResponse({ status: 401, description: "Identifiants non valides ou account pas encore validé par l'administrateur" })
    @Post('login')
    @HttpCode(HttpStatus.ACCEPTED)
    @ResponseMessage('Valid Credentials')
    login(@Body() body:AuthDto){
        return this.authService.login(body.email, body.password);
    }

    
}
