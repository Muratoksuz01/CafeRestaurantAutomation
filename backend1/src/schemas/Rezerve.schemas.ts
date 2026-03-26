import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RezerveDocument = Rezerve & Document;

@Schema({ timestamps: false })
export class Rezerve {

  @Prop({ required: true, trim: true })
  employeeName: string;

  @Prop({ required: true, trim: true })
  employeePhone: string;

  @Prop({ 
    required: true, 
    enum: ["arrived","cancaled","pending"] 
  })
  status: string;

  @Prop({  trim: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;
  
  @Prop({ required: true })
  endDate: Date;
  
  @Prop({ 
    type: Types.ObjectId, 
    ref: "Table", 
    required: true 
  })
  masaId: Types.ObjectId;
}

export const RezerveSchema = SchemaFactory.createForClass(Rezerve);