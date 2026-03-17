import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserRoleDocument = UserRole & Document;

@Schema({ timestamps: true })
export class UserRole {

  @Prop({ type: Types.ObjectId, ref: "Users", required: false })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Roles", required: false })
  roleId: Types.ObjectId;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);