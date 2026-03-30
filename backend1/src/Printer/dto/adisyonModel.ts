export interface IPrintOrderItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface IPrintOrderData {
  orderNo: string;
  tableName: string;
  date: Date | string;
  items: IPrintOrderItem[];
  totalAmount: number;
}