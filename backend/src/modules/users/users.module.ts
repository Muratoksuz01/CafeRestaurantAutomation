import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User, UserSchema } from "../../schemas/User.schemas";
import { Role, RoleSchema } from "../../schemas/Role.schemas";
import { OrderItem, OrderItemSchema } from "../../schemas/OrderItem.schemas";
import { Food, FoodSchema } from "../../schemas/Food.schemas";
import { UserRole, UserRoleSchema } from "../../schemas/UserRole.schemas";
import { Order, OrderSchema } from "../../schemas/Order.schemas";



@Module({
    imports:[
        MongooseModule.forFeature([
            {name:User.name,schema:UserSchema,},{name:UserRole.name,schema:UserRoleSchema,},
            {name:Role.name,schema:RoleSchema,},{name:Order.name,schema:OrderSchema,},
            {name:OrderItem.name,schema:OrderItemSchema,},{name:Food.name,schema:FoodSchema,},
        ]),
        
    ],
    providers:[UsersService],
    controllers:[UsersController]
})
export class UsersModule{

}