import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserArgsDto } from './dtos/get-user.args';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user-input';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel], { name: 'users', defaultValue: [] })
  async getUsers() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Query(() => UserModel, { name: 'user' })
  async getUser(@Args() getUserArgs: GetUserArgsDto) {
    const user = await this.usersService.findOne(getUserArgs.id);
    return user;
  }

  @Mutation(() => UserModel, { name: 'userCreate' })
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.usersService.create(createUserInput);
    return user;
  }

  @Mutation(() => UserModel, { name: 'userUpdate' })
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const user = await this.usersService.update(
      updateUserInput.id,
      updateUserInput,
    );
    return user;
  }
}
