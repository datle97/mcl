import { Report } from 'src/reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('AfterInsert: ' + this.email);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('AfterUpdate: ' + this.email);
  }

  @AfterRemove()
  logRemove() {
    console.log('AfterRemove: ' + this.email);
  }
}
