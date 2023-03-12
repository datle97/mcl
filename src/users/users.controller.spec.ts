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
  const mockUser = {
    id: 123,
    email: mockEmail,
    password: mockPassword,
  } as User;

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
      signup: (email, password) =>
        Promise.resolve({ id: 123, email, password } as User),
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
    const [user] = await controller.findAllUser('asdf2@gmail.com');

    console.log(user);
    expect(user.email).toEqual('asdf2@gmail.com');
  });
});
