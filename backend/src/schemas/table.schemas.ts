import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TableDocument = Table & Document;

@Schema({ timestamps: false })
export class Table {

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ 
    required: true, 
    enum: ["bos", "dolu", "rezerve"] 
  })
  status: string;

  @Prop({ 
    type: Types.ObjectId, 
    ref: "Order", 
    required: false 
  })
  currentOrderId: Types.ObjectId;
}

export const TableSchema = SchemaFactory.createForClass(Table);