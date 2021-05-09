import { DateTime } from 'luxon';

import { UserModel } from '@users/models/user.model';

export class JwtPayloadDto {
  sub: string;
  exp?: number;
  iat: number;
  email: string;

  static fromUserModel(userModel: UserModel): JwtPayloadDto {
    return {
      sub: userModel.id,
      iat: DateTime.now().toSeconds(),
      email: userModel.email,
    };
  }
}
