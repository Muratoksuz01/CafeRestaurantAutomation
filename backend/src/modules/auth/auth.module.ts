import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { User, UserSchema } from "../../schemas/User.schemas";
import { UserRole, UserRoleSchema } from "../../schemas/UserRole.schemas";
import { Role, RoleSchema } from "../../schemas/Role.schemas";
@Module({
    imports:[
        PassportModule,
        MongooseModule.forFeature([
        {name:User.name, schema:UserSchema },
        {name:UserRole.name, schema:UserRoleSchema},
        {name:Role.name, schema:RoleSchema},
    ]),
    
],
    providers:[AuthService,JwtStrategy],
    controllers:[AuthController],
    //exports:[AuthService]
})
export class AuthModule{}