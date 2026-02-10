import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { User, UserRole } from 'src/entity/user.entity';
import { CreateNewsDto } from 'src/common/dto/create-news.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Actualités')
@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @ApiOperation({ 
        summary: "Lister l'ensemble des actualités (toutes les infos + auteur).",
        description: "L'accès à cette route est public.Tout adhérent peut y accéder." })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Liste des actualités' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(UserRole.CONTRIBUTOR)
    findAll() {
        return this.newsService.findAll();
    }


    @ApiOperation({ 
        summary: 'Récupérer une actualité particulière (toutes les infos + auteur).',
        description: "L'accès à cette route est public.Tout adhérent peut y accéder." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Lister une actualité particulière' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 404, description: 'Aucune actualité trouvée' })
    @ApiParam({
        name: 'id',
        description: "Identifiant unique de l'actualité"
    })
    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    //@Roles(UserRole.CONTRIBUTOR)
    findOne(@Param('id') id: number) {
        return this.newsService.findOne(id);
    }


    @ApiOperation({ 
        summary: 'Créer une actualité',
        description: "Seul les adhérents ayant le rôle CONTRIBUTOR peuvent avoir accès à cette route." 
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Actualité créée' })
    @ApiResponse({ status: 401, description: 'Non autorisé' })
    @ApiResponse({ status: 403, description: 'Accès interdit : cette ressource ne vous appartient pas.' })
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CONTRIBUTOR)
    create(@Body() dto: CreateNewsDto,@GetUser() author: User) {
        return this.newsService.create(dto, author);
    }
}
