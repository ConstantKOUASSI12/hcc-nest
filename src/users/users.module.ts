import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UsersController } from './users.controller';
import { Role } from 'src/entity/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Role]),
    PassportModule,
    JwtModule
    /*JwtModule.register({
      secret: 'SECRET_KEY', // ⚠️ plus tard → env
      signOptions: { expiresIn: '1d' },
    }), */
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
