import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/entity/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ValidateUser } from 'src/common/dto/validate-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Utilisateur')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}


    @ApiOperation({ 
        summary: 'Valider un adhérent',
        description: "Seul super-admin ayant le rôle ADMIN peuvent avoir accès à cette route." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 202, description: 'Adhérent activé' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @ApiResponse({ status: 404, description: 'Adhérent ou role non trouvé.' })
    @ApiResponse({ status: 409, description: 'Adhérent déjà activé.' })
    @Post()
    @Post('validate')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ResponseMessage('User activated')
    async validateUser(@Body() body: ValidateUser) {
        return this.usersService.validate(body);
    }

    @ApiOperation({ 
        summary: "Lister l'ensemble des infos des adhérents de type joueurs (nom, prénom, date d’inscription, matchs auxquels ils participent)",
        description: "Seul les adhérents ayant le rôle COACH peuvent avoir accès à cette route." })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Liste des joueurs' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.COACH)
    async findAll(){
        return this.usersService.findAll();
    }

    @ApiOperation({ 
        summary: "Lister l'ensemble des infos d'un adhérent de type joueurs en particulier (nom, prénom, date d’inscription, matchs auxquels il participe)",
        description: "Seul les adhérents ayant le rôle COACH peuvent avoir accès à cette route." })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Lister un joueur en particulier' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @ApiResponse({ status: 404, description: 'Joueur non trouvé.' })
    @ApiParam({
        name: 'id',
        description: "Identifiant unique de l'utilisateur"
    })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.COACH)
    async findOne(@Param('id') id: number){
        return this.usersService.findOne(id);
    }

}
