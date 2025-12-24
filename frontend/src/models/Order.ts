export interface Order {
  id: string
  tableName: string
  orderDate: string
  orderTotal: number
  waiterName:string
  status: "hazirlaniyor" | "tamamlandi" | "iptal edildi"
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id: string
  foodName: string
  qty: number
  unitPrice: number
  total:number
  imgs?: string
}
