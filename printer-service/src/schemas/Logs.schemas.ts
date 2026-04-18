import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LogsDocument = Logs & Document;

export enum LogStatus {
  ERROR = "error",
  INFO = "info",
  WARN = "warn",
  DEBUG = "debug",
}

@Schema({
  timestamps: {
    currentTime: () => {
      const now = new Date();
      return new Date(now.getTime() + 3 * 60 * 60 * 1000);
    }
  }
})
export class Logs {

  @Prop({ required: true, trim: true })
  source: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ trim: true })
  context: string;

  @Prop({ trim: true })
  stack: string;

  @Prop({ 
    trim: true,
    enum: LogStatus,
    default: LogStatus.INFO,
    required: true
  })
  status: LogStatus;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);