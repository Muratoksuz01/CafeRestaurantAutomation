import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { TablesModule } from './tables/tables.module';
import { CategoriesModule } from './categories/categories.module';
import { FoodsModule } from './foods/foods.module';

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
        // connectionFactory: (connection) => {
        //   // Başarılı bağlantı durumu
        //   console.log("deneniyor ")
        //   connection.on('connected', () => {
        //     console.log('✅ MongoDB bağlantısı başarıyla tamamlandı.');
        //   });

        //   // Bağlantı hatası durumu
        //   connection.on('error', (error) => {
        //     console.error('❌ MongoDB bağlantı hatası:', error);
        //   });

        //   // Bağlantı koptuğunda
        //   connection.on('disconnected', () => {
        //     console.warn('⚠️ MongoDB bağlantısı kesildi!');
        //   });

        //   return connection;
        // },
      }),

    }),
    AuthModule,
    UserModule,
    RolesModule,
    TablesModule,
    CategoriesModule,
    FoodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
