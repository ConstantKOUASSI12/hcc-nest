import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAccountDto } from 'src/common/dto/create-account.dto';
import { User as UserEntity} from 'src/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {

    constructor(
      @InjectRepository(UserEntity)
      private userRepo: Repository<UserEntity>,
      private jwtService: JwtService,
    ) {}

    async register(data: CreateAccountDto): Promise<User> {

      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Vérification email OU contact en une seule requête
      const existingUser = await this.userRepo.findOne({
        where: [
          { email: data.email.trim() },
          { contact: data.contact.trim() },
        ],
      });

      if (existingUser) {
        if (existingUser.email === data.email.trim()) {
          throw new ConflictException('Email already used');
        }
        if (existingUser.contact === data.contact.trim()) {
          throw new ConflictException('Contact already used');
        }
      }

      const user = this.userRepo.create({
        lastname : data.lastname.trim(),
        firstname : data.firstname.trim(),
        email: data.email.trim(),
        contact: data.contact.trim(),
        password: hashedPassword,
      });

      await this.userRepo.save(user);

      const { password, role, isValidated, ...safeUser } = user;
      return safeUser;
    }


    async login(email: string, password: string) {

        const user = await this.userRepo
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.role', 'role')
          /* .leftJoinAndSelect('user.matches', 'match')
          .leftJoinAndSelect('user.news', 'news') */
          .select([
            'user.id',
            'user.firstname',
            'user.lastname',
            'user.email',
            'user.contact',
            'user.createdAt',
            'user.updatedAt',
            'user.isValidated',
            'role.id',
            'role.name'
          ])
          .addSelect('user.password') 
          .where('user.email = :email', { email })
          .getOne();
            
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw new UnauthorizedException('Invalid credentials');
        }

        if (!user?.isValidated || !user?.role.id) {
          throw new UnauthorizedException('Account not validated, please contact administrator');
        }

        const payload = {
          id: user.id,  
          email: user.email,
          role: user.role.name,
          isValidated : user.isValidated
        };

        return {
          access_token: this.jwtService.sign(payload),
        };
        
    }

}
