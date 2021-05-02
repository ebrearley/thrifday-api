import { DateTime } from 'luxon';

import { UserModel } from '@users/models/user.model';

export class JwtPayloadDto {
  sub: string;
  exp?: number;
  iat: number;
  email: string;
  firstName: string;
  lastName: string;

  static fromUserModel(userModel: UserModel): JwtPayloadDto {
    return {
      sub: userModel.id,
      iat: DateTime.now().toSeconds(),
      firstName: userModel.firstName,
      lastName: userModel.lastName,
      email: userModel.email,
    };
  }
}
