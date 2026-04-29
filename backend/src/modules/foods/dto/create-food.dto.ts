import { Types } from "mongoose"

export class CreateFoodDto {
    name:string
    price:number
    description:string
    categoryId:Types.ObjectId
    
}
