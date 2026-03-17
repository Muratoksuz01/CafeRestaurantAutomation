import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TableLocationDocument = TableLocation & Document;

@Schema({ timestamps: true })
export class TableLocation {

  @Prop({ required: true, trim: true })
  name: string;
}

export const TableLocationSchema = SchemaFactory.createForClass(TableLocation);