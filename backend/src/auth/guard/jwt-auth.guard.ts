
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
    if (err || !user) {
      // Burada özel hata mantığı kurabilirsin
     
      throw err || new UnauthorizedException('Lütfen önce giriş yapın!');
    }
   // console.log("hande request user:",user)
    return user;
  }
}
