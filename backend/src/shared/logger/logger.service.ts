import { Injectable, LoggerService } from "@nestjs/common";
import { Logs } from "../../schemas/Logs.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MyLogger implements LoggerService {
  private source = "App";

  constructor(
    
    @InjectModel(Logs.name) private logModel: Model<Logs>
  ) {}

  setSource(source: string) {
    this.source = source;
  }

  log(source: string,message: string) {
    this.save(source,"info", message);
  }

  error(source: string,message: string,  stack?: string) {
    this.save(source,"error", message,stack);
  }

  warn(source: string,message: string, ) {
    this.save(source,"warn", message);
  }

  debug(source: string, message: string, ) {
    this.save(source,"debug", message);
  }

  private async save(
    source: string,
    level: string,
    message: any,
    stack?: string,
  ) {
    await this.logModel.create({
      source: source || this.source,
      message: String(message),
      stack: stack || null,
      status: level,
    });
  }
}