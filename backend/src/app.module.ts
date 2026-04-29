import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './shared/logger/logger.module';
import { User, UserSchema } from './schemas/User.schemas';
import { Role, RoleSchema } from './schemas/Role.schemas';
import { UserRole, UserRoleSchema } from './schemas/UserRole.schemas';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { TablesModule } from './modules/tables/tables.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FoodsModule } from './modules/foods/foods.module';
import { OrderModule } from './modules/order/order.module';
import { RezerveModule } from './modules/rezerve/rezerve.module';
import { PrinterModule } from './modules/printer/printer.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Diğer modüllerde tekrar import etmemek için
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Role.name, schema: RoleSchema },
  { name: UserRole.name, schema: UserRoleSchema },
]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
       
        secret: configService.get<string>('JWT_SECRET'), // .env'den okur
        signOptions: { expiresIn: '1d'  as const }, // 60s çok kısa olabilir, 1h (1 saat) daha yaygındır
      }),
    }),
    LoggerModule,
    AuthModule,
    UsersModule,
    RolesModule,
    TablesModule,
    CategoriesModule,
    FoodsModule,
    OrderModule,
    RezerveModule,
    PrinterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // SeedService
  ],
})
export class AppModule { }



    /*     connectionFactory: (connection) => {
          // Başarılı bağlantı durumu
          console.log("deneniyor ")
          connection.on('connected', () => {
            console.log('✅ MongoDB bağlantısı başarıyla tamamlandı.');
          });

          // Bağlantı hatası durumu
          connection.on('error', (error) => {
            console.error('❌ MongoDB bağlantı hatası:', error);
          });

          // Bağlantı koptuğunda
          connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB bağlantısı kesildi!');
          });

          return connection;
        }, */