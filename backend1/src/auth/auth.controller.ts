import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { LoginDTO } from './dto/Login.dto';
import { RegisterDTO } from './dto/Register.dto';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post("login")
    @UsePipes(new ValidationPipe())
    async login(@Body() loginDTO: LoginDTO) {
        console.log(loginDTO)
        return await this.authService.login(loginDTO)
    }
    @Post("register")
    @UsePipes(new ValidationPipe())
    async register(@Body() registerDTO: RegisterDTO) {
        console.log(registerDTO)
       return await this.authService.register(registerDTO)
    }
}