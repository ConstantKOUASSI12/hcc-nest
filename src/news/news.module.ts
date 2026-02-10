import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { NewsController } from './news.controller';
import { User as UserEntity } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([News,UserEntity])
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService]
})
export class NewsModule {}
