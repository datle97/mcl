import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
