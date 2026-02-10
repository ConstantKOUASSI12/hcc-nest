import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        
    // Token expiré
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(
        'Your session has expired, please log in again.',
      );
    }

    if (info?.message === 'invalid signature') {
      throw new UnauthorizedException(
        'Token with invalid signature.Please log in again',
      );
    }

    // Token invalide / absent
    if (err || !user) {
      throw new UnauthorizedException(
        'Authentification required',
      );
    }

    return user;
  }
}
