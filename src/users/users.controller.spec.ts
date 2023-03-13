import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  // Create a fake copy of the users service
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let users: User[];
  const mockEmail = 'asdf@gmail.com';
  const mockPassword = 'qweqwe';

  beforeEach(async () => {
    users = [];
    fakeUsersService = {
      find: (email) =>
        Promise.resolve([
          {
            id: 123,
            email,
            password: mockPassword,
          } as User,
        ]),
      findOne: (id) =>
        Promise.resolve({
          id,
          email: mockEmail,
          password: mockPassword,
        } as User),
      // update: (id, attrs) =>
      //   Promise.resolve({
      //     id,
      //     email: mockEmail,
      //     password: mockPassword,
      //     ...attrs,
      //   } as User),
      // remove: (id) =>
      //   Promise.resolve({
      //     id,
      //     email: mockEmail,
      //     password: mockPassword,
      //   } as User),
    };
    fakeAuthService = {
      // signup: (email, password) =>
      //   Promise.resolve({ id: 123, email, password } as User),
      signin: (email, password) =>
        Promise.resolve({ id: 123, email, password } as User),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('asdf2@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf2@gmail.com');
  });
  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('123');
    expect(user.id).toEqual(123);
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = (id) => {
      if (!id) {
        throw new NotFoundException('User not found');
      }

      const users = [
        {
          id: 1234,
          email: mockEmail,
          password: mockPassword,
        } as User,
      ];

      const user = users.find((item) => +item.id === +id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return Promise.resolve(user);
    };

    await expect(controller.findUser('12345')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin updates session object and returns user', async () => {
    const session: any = {};
    const user = await controller.signin(
      {
        email: mockEmail,
        password: mockPassword,
      },
      session,
    );

    expect(+session.userId).toEqual(+user.id);
  });
});
