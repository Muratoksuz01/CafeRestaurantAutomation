import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "../schemas/Role.schemas";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { MyLogger } from "../logger/logger.service";
import { LoggerModule } from "../logger/logger.module";

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