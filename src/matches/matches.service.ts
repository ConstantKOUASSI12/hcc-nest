import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entity/match.entity';
import { User, UserRole } from 'src/entity/user.entity';
import { CreateMatchDto } from 'src/common/dto/create-match.dto';
import { UpdateMatchDto } from 'src/common/dto/update-match.dto';
import { match } from 'assert';

@Injectable()
export class MatchesService {
    constructor(
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
  
  async create(dto: CreateMatchDto, coach: User) {

    const existing = await this.matchRepo.findOne({
      where: { date: dto.date },
    });

    if (coach.role.name !== 'COACH') {
      throw new ForbiddenException('Only coach can create match');
    }

    if (existing) {
      throw new BadRequestException('There is already a match today.');
    }

    const match = this.matchRepo.create({
      ...dto,
      coach
    });

    return await this.matchRepo.save(match);
  }

  async update(id: number, dto: UpdateMatchDto, coach: User) {

    const match = await this.matchRepo.findOne({
      where: { id },
      relations: ['coach'],
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.coach.id !== coach.id) {
      throw new ForbiddenException(
        "You can't modify this match because you aren't the author",
      );
    }

    if (dto.date && dto.date !== match.date) {
      const existingMatch = await this.matchRepo.findOne({
        where: { date: dto.date },
      });

      if (existingMatch) {
        throw new BadRequestException('There is already a match on this date.');
      }
    }

    Object.assign(match, dto);

    return await this.matchRepo.save(match);
}


  async findAll() {
    return this.matchRepo.find({
      relations: ['players'],
    });
  }

  async findOne(id: number) {

    const match = await this.matchRepo.findOne({
      where: { id },
      relations: ['players'],
    });

    if (!match) {
      throw new NotFoundException('New not found');
    }

    return match
  }

  async registerPlayer(matchId: number, user: User) {

    const match = await this.matchRepo.findOne({
      where: { id: matchId },
      relations: ['players'],
    });

    if (match?.isFinished) throw new ConflictException('You cannot register for a match that has ended.')

    if (!match) throw new NotFoundException("Match Not Found");

    const isAlreadyRegistered = match.players.some(
        (player) => player.id === user.id,
    );

    if (isAlreadyRegistered) {
        throw new BadRequestException('Player already registered for this match');
    }

    /* const user = await this.userRepo.findOne({
      where: { id: userId },
    }); */

    if (!user) {
        throw new NotFoundException('User Not Found');
    }
    
    if (user.role.name !== 'PLAYER') {
      throw new ForbiddenException('Only players can register.');
    }

    match.players.push(user);

    return this.matchRepo.save(match);
  }
  

  async unregisterPlayer(matchId: number, user: User) {
    
    const match = await this.matchRepo.findOne({
      where: { id: matchId },
      relations: ['players'],
    });

    if (!match) throw new NotFoundException();

    match.players = match.players.filter(
      (player) => player.id !== user.id,
    );

    return this.matchRepo.save(match);
  }

}
