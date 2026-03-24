import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem {

  @Prop({ type: Types.ObjectId, ref: "Food", required: true })
  foodId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Order", required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  qty: number;

  @Prop({ required: true })
  unitprice: number;

  @Prop({ required: true })
  total: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);