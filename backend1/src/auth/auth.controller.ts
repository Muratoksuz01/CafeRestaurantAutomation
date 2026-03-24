import { Body, Controller, Post, UsePipes, ValidationPipe,UseGuards ,Request, Get } from "@nestjs/common";
import { LoginDTO } from './dto/Login.dto';
import { RegisterDTO } from './dto/Register.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
   // @UseGuards(AuthGuard('local'))
    @Post("login")
    @UsePipes(new ValidationPipe())
    async login(@Request() req , @Body() loginDTO: LoginDTO) {
            console.log(loginDTO)
            return await this.authService.login(loginDTO)
        }
        // async login(@Request() req) {   
        //     return req.user;
        // }
    @Post("register")
    @UsePipes(new ValidationPipe())
    async register(@Body() registerDTO: RegisterDTO) {
        console.log(registerDTO)
       return await this.authService.register(registerDTO)
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUsers(@Request() req){
        return this.authService.getUsers(req)
    }
}