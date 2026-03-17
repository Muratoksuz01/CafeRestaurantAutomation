import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: "Order", required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, enum: ["cart", "nakit"] })
  paymentType: string;

  @Prop({ required: true })
  total: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);