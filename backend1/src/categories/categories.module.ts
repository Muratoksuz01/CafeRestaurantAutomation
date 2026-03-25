import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/schemas/Category.schemas';
import { Food, FoodSchema } from 'src/schemas/Food.schemas';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports:[
    PassportModule,
    MongooseModule.forFeature([
          {name:Category.name, schema:CategorySchema },
          {name:Food.name, schema:FoodSchema},
      ])
    ],
  controllers: [CategoriesController],
  providers: [CategoriesService,JwtStrategy,
  //   {
  //   provide: APP_GUARD,// bundan emin degilim 
  //   useClass: RolesGuard,
  // }
  ],
})
export class CategoriesModule {}
