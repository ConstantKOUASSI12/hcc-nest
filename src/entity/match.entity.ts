import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Match {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  // Date du match (1 seul match par jour)
  @ApiProperty()
  @Column({ unique: true })
  date: string;


  // Heure du match
  @ApiProperty()
  @Column()
  time: string;

  // Équipe adverse
  @ApiProperty()
  @Column()
  opponent: string;

  // Lieu du match
  @ApiProperty()
  @Column()
  location: string;

  // Score final (ex: 28-25)
  @ApiProperty()
  @Column({ nullable: true })
  score: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'coachId' })
  coach: User;

  // Indique si le match est terminé
  @ApiProperty()
  @Column({ default: false })
  isFinished: boolean;

  // Commentaire du coach
  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  comment: string;

  // Date de création
  @CreateDateColumn()
  createdAt: Date;

  // Dernière modification
  @UpdateDateColumn()
  updatedAt: Date;

  // Joueurs inscrits
  @ManyToMany(() => User, (user) => user.matches)
  @JoinTable()
  players: User[];

}
