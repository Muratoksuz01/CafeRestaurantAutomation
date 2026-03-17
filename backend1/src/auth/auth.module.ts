import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "src/schemas/Role.schemas";
import { User, UserSchema } from "src/schemas/User.schemas";
import { UserRole, UserRoleSchema } from "src/schemas/UserRole.schemas";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports:[
        MongooseModule.forFeature([
        {name:User.name, schema:UserSchema },
        {name:UserRole.name, schema:UserRoleSchema},
        {name:Role.name, schema:RoleSchema},
    ])
],
    providers:[AuthService],
    controllers:[AuthController],
    //exports:[AuthService]
})
export class AuthModule{}