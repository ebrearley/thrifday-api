import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { AuthLoginInput } from './inputs/login.input';
import { AuthRegisterInput } from './inputs/register.input';
import { UserModel } from '@users/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: AuthLoginInput) {
    const user = await this.usersService.findOneByEmail(input.email);

    if (!user) {
      throw new NotFoundException(`User with ${input.email} was not found.`);
    }

    const isPasswordValid = await this.validatePassword(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'The password you have provided is not correct',
      );
    }

    return {
      token: this.signToken(user),
      user: UserModel.fromUserEntity(user),
    };
  }

  async register(input: AuthRegisterInput) {
    const existingUser = await this.usersService.findOneByEmail(input.email);
    if (existingUser) {
      throw new ConflictException(
        `Account with email ${input.email} already exists.`,
      );
    }

    const user = await this.usersService.create(input);

    return {
      token: this.signToken(user),
      user: UserModel.fromUserEntity(user),
    };
  }

  async validateUserExists(userId: string) {
    try {
      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new UnauthorizedException();
      }

      return UserModel.fromUserEntity(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async validatePassword(inputPassword, databasePassword) {
    const isMatching = await bcrypt.compare(inputPassword, databasePassword);
    return isMatching;
  }

  private signToken(user: UserModel) {
    const payload = JwtPayloadDto.fromUserModel(user);
    return this.jwtService.sign(payload, { algorithm: 'HS256' });
  }
}
