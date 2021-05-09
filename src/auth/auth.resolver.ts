import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthLoginInput } from './inputs/login.input';
import { AuthRegisterInput } from './inputs/register.input';
import { TokenUserModel } from './models/token-user.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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
