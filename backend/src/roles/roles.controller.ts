import { UpdateRoles } from './dto/UpdateRoles';
import { CreateRoles } from "./dto/CreateRoles";
import { RolesService } from "./roles.service";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller("roles")
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Post()
    async createRole(@Body() createRole: CreateRoles) {
        return await this.rolesService.createRole(createRole);
    }

    @Put(":id")
    async updateRole(
        @Param("id") id: string,
        @Body() updateRole: UpdateRoles
    ) {
        return  await this.rolesService.updateRole(id, updateRole);
    }

    @Delete(":id")
    async deleteRole(@Param("id") id: string) {
        return await this.rolesService.deleteRole(id);
    }

    @Get()
    async getRoles() {
        return await this.rolesService.getRoles();
    }

    @Get(":id")
    async getRole(@Param("id") id: string) {
        return await this.rolesService.getRole(id);
    }
}