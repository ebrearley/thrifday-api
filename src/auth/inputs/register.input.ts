import { InputType } from '@nestjs/graphql';
import { AuthLoginInput } from './login.input';

@InputType()
export class AuthRegisterInput extends AuthLoginInput {}
