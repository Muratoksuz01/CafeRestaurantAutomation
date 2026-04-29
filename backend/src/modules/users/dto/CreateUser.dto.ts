import { IsNotEmpty, IsString } from "class-validator";

export class CreateUser {
    
      email:string
    firstName:string
    lastName:string
    phoneNumber:string
    roleName:string
    isActive:boolean
    password:string
}