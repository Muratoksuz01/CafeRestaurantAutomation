import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/User.schemas";
import { UsersService } from "./users.service";

@Module({
    imports:[
        MongooseModule.forFeature([{
            name:User.name,
            schema:UserSchema,
        }])
    ],
    providers:[UsersService]
})
export class UserModule{

}