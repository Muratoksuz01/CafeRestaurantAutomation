import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {

  @Prop({ type: Types.ObjectId, ref: "Tables", required: true })
  tableId: Types.ObjectId;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, enum: ["hazirlaniyor", "tamamlandi", "iptal edildi"] })
  status: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "OrderItem" }], required: false })
  orderItems: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: "User" })
  waiterId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);