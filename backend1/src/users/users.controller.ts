import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "./dto/CreateUser.dto";
import { UpdateUser } from "./dto/UpdateUser";


@Controller("users")
export class AuthController {
    constructor(private usersService: UsersService) { }
    @Get("getAdminStats")
    async getAdminStats() {
        return this.usersService.getAdminStats();
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: string) {
        return this.usersService.deleteUser(id);
    }

    @Put(":id")
    async updateUser(
        @Param("id") id: string,
        @Body() updateUser: UpdateUser
    ) {
        return this.usersService.updateUser(id, updateUser);
    }

    @Get(":id")
    async getUser(@Param("id") id: string) {
        return this.usersService.getUser(id);
    }

    @Get()
    async getUsers() {
        return this.usersService.getUsers();
    }

    @Get("register")
    async getRoles() {
        return this.usersService.getRoles();
    }

    @Post()
    async createUser(@Body() createUser: CreateUser) {
        return this.usersService.createUser(createUser);
    }
}