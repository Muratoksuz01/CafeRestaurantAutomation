import { Injectable, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Logs } from "../schemas/Logs.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MyLogger implements LoggerService {
  private context = "App";

  constructor(
    @InjectRepository(Logs)
    private readonly logRepo: Repository<Logs>,
    @InjectModel(Logs.name) private logModel: Model<Logs>
  ) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.save("info", message, context);
  }

  error(message: any,  stack?: string) {
    this.save("error", message,"",stack);
  }

  warn(message: any, context?: string) {
    this.save("warn", message, context);
  }

  debug(message: any, context?: string) {
    this.save("debug", message, context);
  }

  private async save(
    level: string,
    message: any,
    context?: string,
    stack?: string,
  ) {
    await this.logModel.create({
      source: context || this.context,
      message: String(message),
      context: context || this.context,
      stack: stack || null,
      status: level,
    });
  }
}