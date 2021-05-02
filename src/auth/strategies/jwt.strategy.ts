import { AuthService } from '@auth/auth.service';
import { JwtPayloadDto } from '@auth/dto/jwt-payload.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayloadDto) {
    const user = await this.authService.validateUserExists(payload.sub);
    return user;
  }
}
