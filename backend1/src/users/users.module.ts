import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/User.schemas";
import { UsersService } from "./users.service";
import { UserRole, UserRoleSchema } from "src/schemas/UserRole.schemas";
import { Order, OrderSchema } from "src/schemas/Order.schemas";
import { OrderItem, OrderItemSchema } from "src/schemas/OrderItem.schemas";
import { Food, FoodSchema } from "src/schemas/Food.schemas";
import { UsersController } from "./users.controller";
import { Role, RoleSchema } from "src/schemas/Role.schemas";

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:User.name,schema:UserSchema,},
            {name:UserRole.name,schema:UserRoleSchema,},
            {name:Role.name,schema:RoleSchema,},
            {name:Order.name,schema:OrderSchema,},
            {name:OrderItem.name,schema:OrderItemSchema,},
            {name:Food.name,schema:FoodSchema,},
          // {name:RoleAction.name,schema:RoleActionSchema,},
        
        ])
    ],
    providers:[UsersService],
    controllers:[UsersController]
})
export class UsersModule{

}