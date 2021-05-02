import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { head, last } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (!ctx?.headers?.authorization) {
      return false;
    }

    ctx.jwtPayload = await this.validateToken(ctx.headers.authorization);
    return ctx;
  }

  validateToken(authorisationHeaderValue: string) {
    const invalidTokenException = new ForbiddenException('Invalid token.');

    if (!authorisationHeaderValue) {
      throw invalidTokenException;
    }

    const authorisationHeaderParts = authorisationHeaderValue.split(' ');
    if (head(authorisationHeaderParts) !== 'Bearer') {
      throw invalidTokenException;
    }

    const token = last(authorisationHeaderParts);

    console.log('token', token);
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw invalidTokenException;
    }
  }
}
