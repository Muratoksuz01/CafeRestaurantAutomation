import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "src/schemas/Role.schemas";
import { CreateRoles } from "./dto/CreateRoles";
import { UpdateRoles } from "./dto/UpdateRoles";

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) { }

    async createRole(createRole: CreateRoles) {
        try {
            const role = new this.roleModel(createRole);
            return await role.save();
        } catch (error) {
            console.error("Role Create Hatası:", error);
            throw error;
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
                    { success: false, message: "Role not found" },
                    HttpStatus.OK
                );
            }

            return role;
        } catch (error) {
            console.error("Role Update Hatası:", error);
            throw error;
        }
    }

    async deleteRole(id: string) {
        try {
            const role = await this.roleModel.findByIdAndDelete(id);

            if (!role) {
                throw new HttpException(
                    { success: false, message: "Role not found" },
                    HttpStatus.OK
                );
            }

            return { success: true, message: "Role deleted" };
        } catch (error) {
            console.error("Role Delete Hatası:", error);
            throw error;
        }
    }

    async getRoles() {
        try {
            return await this.roleModel.find();
        } catch (error) {
            console.error("Roles Get Hatası:", error);
            throw error;
        }
    }

    async getRole(id: string) {
        try {
            const role = await this.roleModel.findById(id);

            if (!role) {
                throw new HttpException(
                    { success: false, message: "Role not found" },
                    HttpStatus.OK
                );
            }

            return role;
        } catch (error) {
            console.error("Role Get Hatası:", error);
            throw error;
        }
    }
}