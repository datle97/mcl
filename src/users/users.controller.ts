import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(
    @CurrentUser()
    user: User,
  ) {
    return user;
  }

  @Get('/signout')
  signOut(
    @Session()
    session: any,
  ) {
    session.userId = null;
  }

  @Post('/signup')
  async signup(
    @Body()
    body: CreateUserDto,
    @Session()
    session: any,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body()
    body: CreateUserDto,
    @Session()
    session: any,
  ) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get()
  findAllUser(
    @Query('email')
    email: string,
  ) {
    return this.userService.find(email);
  }

  @Get('/:id')
  async findUser(
    @Param('id')
    id: string,
  ) {
    const user = await this.userService.findOne(+id);

    return user;
  }

  @Patch('/:id')
  updateUser(
    @Param('id')
    id: UpdateUserDto,
    @Body()
    body: UpdateUserDto,
  ) {
    return this.userService.update(+id, body);
  }

  @Delete('/:id')
  removeUser(
    @Param('id')
    id: string,
  ) {
    return this.userService.remove(+id);
  }
}
