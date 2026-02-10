import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { NewsController } from './news/news.controller';
import { NewsModule } from './news/news.module';
import { MatchesController } from './matches/matches.controller';
import { MatchesModule } from './matches/matches.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/hcc.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true
    }),
    AuthModule,
    UsersModule,
    NewsModule,
    MatchesModule,
  ],
  controllers: [AppController, AuthController, UsersController, NewsController, MatchesController],
  providers: [AppService],
})
export class AppModule {}
