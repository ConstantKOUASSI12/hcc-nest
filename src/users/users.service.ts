import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity, UserRole} from 'src/entity/user.entity';
import { ValidateUser } from 'src/common/dto/validate-user.dto';
import { Role as RoleEntity } from 'src/entity/roles.entity';

@Injectable()
export class UsersService {

    constructor(
      @InjectRepository(UserEntity)
      private userRepo: Repository<UserEntity>,
      @InjectRepository(RoleEntity)
      private rolesRepo: Repository<RoleEntity>,
      private jwtService: JwtService,
    ) {}

    async validate(data: ValidateUser) {
      const { userId, roleId } = data;

      const user = await this.userRepo.findOne({
        where: { id: Number(userId) },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isValidated) {
        throw new ConflictException('User already activated');
      }

      const role = await this.rolesRepo.findOne({
        where: { id: Number(roleId) },
      });

      if (!role) {
        throw new NotFoundException(`Role ID ${roleId} not found`);
      }

      user.isValidated = true;
      user.role = role;

      return await this.userRepo.save(user);
    }


    async findAll(){
      return await this.userRepo.find({
        where: {role : {id : 4}},
        relations: ['matches','role']
      })
    }

    async findOne(id: number){
      const user = await this.userRepo.findOne({
        where: {role : {id : 4}, id: id},
        relations: ['matches']
      })

      if (!user){
        throw new NotFoundException('User Not Found');
      }

      return user
    }
}