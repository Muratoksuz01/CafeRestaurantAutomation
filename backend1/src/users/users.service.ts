import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schemas';
import { UpdateUser } from './dto/UpdateUser';
import { CreateUser } from './dto/CreateUser.dto';
@Injectable()
export class UsersService{
    constructor(
        @InjectModel(User.name) private userModel:Model<User>
    ){}

 async getAdminStats() {
        // TODO
    }

    async deleteUser(id: string) {
        // TODO
    }

    async updateUser(id: string, updateUser: UpdateUser) {
        // TODO
    }

    async getUser(id: string) {
        // TODO
    }

    async getUsers() {
        // TODO
    }

    async getRoles() {
        // TODO
    }

    async createUser(createUser: CreateUser) {
        // TODO
    }

}