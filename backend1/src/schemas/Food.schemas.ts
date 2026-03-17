import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FoodDocument = Food & Document;

@Schema({ timestamps: true })
export class Food {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  categoryId: Types.ObjectId;

  @Prop({
    type: [String],
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length === 2,
      message: "imgs alanı tam olarak 2 elemanlı bir string dizisi olmalıdır.",
    },
  })
  imgs: string[];

  @Prop({ required: false })
  isDeleted: boolean;
}

export const FoodSchema = SchemaFactory.createForClass(Food);