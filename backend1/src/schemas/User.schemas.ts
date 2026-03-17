import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from "bcryptjs";

export type UserDocument = User & Document & {
  comparePassword(plainPassword: string): Promise<boolean>;
};

@Schema({ timestamps: true })
export class User {

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: null })
  isActive: boolean;

  // @Prop({ enum: ["admin", "user"], default: "user" })
  // role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// pre save (password hash)
UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// method (compare password)
UserSchema.methods.comparePassword = function (plainPassword: string) {
  return bcrypt.compare(plainPassword, this.password);
};