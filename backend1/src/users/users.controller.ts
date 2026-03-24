import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "./dto/CreateUser.dto";
import { UpdateUser } from "./dto/UpdateUser";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";


@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }
    @Get("getAdminStats")
    async getAdminStats(@Request() req) {
        return this.usersService.getAdminStats(req);
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
    async getUsers(@Request() req) {
        return this.usersService.getUsers(req);
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