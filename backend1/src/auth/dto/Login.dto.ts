import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDTO {
   
    email: string;

    password: string;
}