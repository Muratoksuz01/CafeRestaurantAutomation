import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "src/schemas/Role.schemas";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";

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