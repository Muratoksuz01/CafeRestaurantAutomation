import {Prop,Schema,SchemaFactory}  from "@nestjs/mongoose"
import {Document,Types} from "mongoose"

export type PrinterDocument=Printer & Document
@Schema({timestamps:true})
export class Printer{
    @Prop({required:true,trim:true})
    name:string
    // @Prop({required:false,trim:true})
    // printerId:string
    @Prop({required:false,trim:true})
    printerIp:string
    @Prop({required:false,trim:true})
    printerType:string
}
export const PrinterSchema=SchemaFactory.createForClass(Printer);