import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateMatchDto } from 'src/common/dto/create-match.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateMatchDto } from 'src/common/dto/update-match.dto';
import { User, UserRole } from 'src/entity/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';



@ApiTags('Match')
@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) {}


    @ApiOperation({ 
            summary: "Lister l'ensemble des infos de l’ensemble des matchs + liste des participants.",
            description: "L'accès à cette route est public.Tout adhérent peut y accéder." })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Liste des matchs' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(UserRole.COACH,UserRole.PLAYER)
    findAll() {
        return this.matchesService.findAll();
    }


    @ApiOperation({ 
        summary: 'Récupérer les infos d’un match particulier + liste des participants.',
        description: "L'accès à cette route est public.Tout adhérent peut y accéder." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Lister un match particulier' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 404, description: 'Aucun match trouvé' })
    @ApiParam({
        name: 'id',
        description: 'Identifiant unique du match'
    })
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(UserRole.COACH,UserRole.PLAYER)
    findOne(@Param('id') id: number) {
        return this.matchesService.findOne(id);
    }

    @ApiOperation({ 
        summary: 'Créer un match',
        description: "Seul les adhérents ayant le rôle COACH peuvent avoir accès à cette route." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 202, description: 'Match créé' })
    @ApiResponse({ status: 400, description: "Il y a déjà un match aujourd'hui." })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @Post()
    @HttpCode(HttpStatus.ACCEPTED) 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.COACH)
    @ResponseMessage('Match created successfully')
    create(@Body() dto: CreateMatchDto, @GetUser() coach: User) {
        return this.matchesService.create(dto,coach);
    }


    @ApiOperation({ 
        summary: "Mettre à jour les informations d'un match",
        description: "Seul les adhérents ayant le rôle COACH peuvent avoir accès à cette route." 
    })
    @ApiBody({ type: UpdateMatchDto })
    @ApiBearerAuth()
    @ApiResponse({ status: 202, description: 'Match mis à jour' })
    @ApiResponse({ status: 400, description: "Il y a déjà un match aujourd'hui." })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @ApiResponse({ status: 404, description: 'Aucun match trouvé.' })
    @ApiParam({
    name: 'id',
    description: 'Identifiant unique du match à modifier'
    })
    @Put(':id')
    @HttpCode(HttpStatus.ACCEPTED) 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.COACH)
    update(
        @Param('id') id: number,
        @Body() dto: UpdateMatchDto,
        @GetUser() coach: User
    ) {
        return this.matchesService.update(id, dto,coach);
    }


    @ApiOperation({ 
        summary: "Inscription à un match",
        description: "Seul les adhérents ayant le rôle PLAYER peuvent avoir accès à cette route." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 202, description: 'Inscription au match terminée avec succès' })
    @ApiResponse({ status: 400, description: "Joueur déjà inscrit pour ce match." })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @ApiResponse({ status: 404, description: 'Aucun match ou utilisateur trouvé.' })
    @ApiResponse({ status: 409, description: 'Vous ne pouvez pas vous inscrire à un match qui est terminé..' })
    @ApiParam({
        name: 'id',
        description: 'Identifiant unique du match'
    })
    @Post(':id/register')
    @ResponseMessage('Registration for the match successfully completed')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PLAYER)
    register(@Param('id') id: number, @GetUser() user: User) {
        return this.matchesService.registerPlayer(id, user);
    }


    @ApiOperation({ 
        summary: "Désinscription à un match",
        description: "Seul les adhérents ayant le rôle PLAYER peuvent avoir accès à cette route." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 202, description: 'Inscription au match annulée avec succès' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @ApiResponse({ status: 404, description: 'Aucun match ou utilisateur trouvé.' })
    @ApiParam({
        name: 'id',
        description: 'Identifiant unique du match'
    })
    @Delete(':id/unregister')
    @ResponseMessage('Match registration successfully canceled')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.PLAYER)
    unregister(@Param('id') id: number, @GetUser() user: User) {
        return this.matchesService.unregisterPlayer(id, user);
    }
}
