import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  // Create a fake copy of the users service
  let fakeUsersService: Partial<UsersService>;
  let users: User[];
  const mockEmail = 'asdf@gmail.com';
  const mockPassword = 'qweqwe';
  beforeEach(async () => {
    users = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user with a salted and hashed password', async () => {
      const user = await service.signup(mockEmail, mockPassword);

      expect(user.password).not.toEqual(mockPassword);
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
      await service.signup(mockEmail, mockPassword);
      await expect(service.signup(mockEmail, mockPassword)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('signin', () => {
    it('throws if signin is called with an unused email', async () => {
      await expect(service.signin(mockEmail, mockPassword)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('throws if an invalid password is provided', async () => {
      await service.signup(mockEmail, mockPassword);
      await expect(
        service.signin(mockEmail, mockPassword + 'asd'),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provided', async () => {
      await service.signup(mockEmail, mockPassword);
      const user = await service.signin(mockEmail, mockPassword);
      expect(user).toBeDefined();
    });
  });
});
