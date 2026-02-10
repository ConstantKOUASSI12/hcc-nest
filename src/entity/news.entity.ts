import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class News {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  content: string;
  

  @ManyToOne(() => User, (user) => user.news, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
