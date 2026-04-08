import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService'i ekledik

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) { // ConfigService'i inject ettik
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // .env içindeki JWT_SECRET değerini buradan okuyoruz
      secretOrKey: configService.get<string>('JWT_SECRET')!, 
    });
  }

  async validate(payload: any) {
    // Payload içindeki veriler (sub, email vb.) artık req.user olarak döner
   //console.log("jwt.stag dosyası validate caliıtı:",payload)4
  //  console.log("jwt strategy.ts dosyası ",payload)
    return { 
    userId: payload.userId, // payload.sub yerine payload.userId
    roleName: payload.roleName // Payload'da ne varsa onu alıyoruz
  };
  }
}