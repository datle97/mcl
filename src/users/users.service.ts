import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string): Promise<User> {
    // create a new instance of a User Entity, and then assigns the email, password you supplied to create to that entity
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    if (!id) {
      throw new NotFoundException('User not found');
    }

    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    return this.repo.remove(user);
  }
}
