import { IsNotEmpty, IsString } from "class-validator";

export class CreateUser {
    @IsString()
    @IsNotEmpty()
    fistName:string
}