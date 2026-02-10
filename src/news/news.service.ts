import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { Repository } from 'typeorm';
import { User as UserEntity } from 'src/entity/user.entity';
import { CreateNewsDto } from 'src/common/dto/create-news.dto';

@Injectable()
export class NewsService {

    constructor(
        @InjectRepository(News)
        private readonly newsRepo: Repository<News>,

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {}

    async create(dto: CreateNewsDto, author:UserEntity): Promise<News> {

        if (!author) {
            throw new NotFoundException('User not found');
        }

        const news = this.newsRepo.create({
            ...dto,
            author,
        });

        return await this.newsRepo.save(news);
    }

    async findAll(): Promise<News[]> {
        return this.newsRepo.find({
        order: { createdAt: 'DESC' },
    });
  }

    async findOne(id: number): Promise<News> {
        const news = await this.newsRepo.findOne({ where: { id } });
        if (!news) {
            throw new NotFoundException('New not found');
        }

        return news;
    }
}
