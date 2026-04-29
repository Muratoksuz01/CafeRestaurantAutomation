import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Role, RoleSchema } from "../../schemas/Role.schemas";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Role.name,schema: RoleSchema,}
        
        ])
    ],
    providers: [RolesService],
    controllers: [RolesController]

})
export class RolesModule { }