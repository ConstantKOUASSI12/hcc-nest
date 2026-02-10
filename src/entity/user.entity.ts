import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from '../entity/match.entity';
import { News } from "../entity/news.entity"
import { Exclude } from 'class-transformer';
import { Role } from './roles.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  COACH = 'COACH',
  CONTRIBUTOR = 'CONTRIBUTOR',
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN'
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstname: string;

  @ApiProperty()
  @Column()
  lastname: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  contact: string;

  @ApiProperty()
  @Column({ select: false })
  //@Exclude()
  //@Column()
  password: string;

  /* @Column({
    type: 'text',
    //default: UserRole.PLAYER,
    default: null,
  })
  role: string; */

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isValidated: boolean;

  @ManyToMany(() => Match, (match) => match.players)
  matches: Match[];

  @OneToMany(() => News, (news) => news.author)
  news: News[];
}
