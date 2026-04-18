import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "../schemas/Role.schemas";
import { CreateRoles } from "./dto/CreateRoles";
import { UpdateRoles } from "./dto/UpdateRoles";
import { MyLogger } from "../logger/logger.service";

@Injectable()
export class RolesService {
    constructor(
        private readonly logger:MyLogger,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) { 
            this.logger.setContext("RolesService")

    }

    async createRole(createRole: CreateRoles) {
        try {
            const role = new this.roleModel(createRole);
            return await role.save();
        } catch (error:any) {
            console.error("Role Create Hatası:", error);
            this.logger.error(`Role Update Hatası: -Data:${JSON.stringify(createRole)} -  Hata: ${error.message}`,error.stack)


            throw new InternalServerErrorException('Rol olusturulurken teknik bir hata oluştu.');
        }
    }

    async updateRole(id: string, updateRole: UpdateRoles) {
        try {
            const role = await this.roleModel.findByIdAndUpdate(
                id,
                updateRole,
                { new: true }
            );

            if (!role) {
                throw new HttpException(
                    { status: false, message: "Role not found" },
                    HttpStatus.OK
                );
            }

            return role;
        } catch (error:any) {
            console.error("Role Update Hatası:", error);
            this.logger.error(`Role Update Hatası: Gelen Id:${id} -Data:${JSON.stringify(updateRole)} -  Hata: ${error.message}`,error.stack)


            throw new InternalServerErrorException('Rol guncellenirken teknik bir hata oluştu.');
        }
    }

    async deleteRole(id: string) {
        try {
            const role = await this.roleModel.findByIdAndDelete(id);

            if (!role) {
                throw new HttpException(
                    { status: false, message: "Role not found" },
                    HttpStatus.OK
                );
            }

            return { status: true, message: "Role deleted" };
        } catch (error:any) {
            console.error("Role Delete Hatası:", error);
            this.logger.error( ` Role Delete Hatası: Gelen Id:${id} -  Hata: ${error.message}`,error.stack)

            throw new InternalServerErrorException('Rol silinirken teknik bir hata oluştu.');
        }
    }

    async getRoles() {
        try {
            return await this.roleModel.find().lean();
        } catch (error:any) {
            console.error("Roles Get Hatası:", error);
            this.logger.error( ` Role GetUser Hatası  Hata: ${error.message}`,error.stack)

            throw new InternalServerErrorException('Roller getirilirken teknik bir hata oluştu.');
        }
    }

    async getRole(id: string) {
        try {
            const role = await this.roleModel.findById(id);

            if (!role) {
                throw new HttpException(
                    { status: false, message: "Role not found" },
                    HttpStatus.OK
                );
            }

            return role;
        } catch (error:any) {
            console.error("Role GetRole Hatası:", error);
            this.logger.error( ` Role GetRole Hatası: Gelen Id:${id} -  Hata: ${error.message}`,error.stack)

            throw new InternalServerErrorException('Rol getirilirken teknik bir hata oluştu.');
        }
    }
}