import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserModel } from '@users/models/user.model';
import { UsersService } from '@users/users.service';
import { AuthService } from './auth.service';
import { CtxUser } from './decorators/ctx-user.decorator';
import { GqlAuthGuard } from './guards/gql-guard.guard';
import { AuthLoginInput } from './inputs/login.input';
import { AuthRegisterInput } from './inputs/register.input';
import { TokenUserModel } from './models/token-user.model';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  currentUser(@CtxUser() user: UserModel) {
    return user;
  }

  @Mutation(() => TokenUserModel)
  async register(
    @Args({ name: 'input', type: () => AuthRegisterInput })
    input: AuthRegisterInput,
  ) {
    const userToken = await this.authService.register(input);
    return userToken;
  }

  @Mutation(() => TokenUserModel)
  async login(
    @Args({ name: 'input', type: () => AuthLoginInput })
    input: AuthLoginInput,
  ) {
    const userToken = await this.authService.login(input);
    return userToken;
  }
}
