export interface GetTable {
    _id: string
    name: string
    status: string
    adisyon: {
        foodId: string;
        qty: number;
        price: number;
        name: string;
    }[]
}

export interface CreateOrder {
  order: {
    tableId: string;
    total: number;
    status: string;
    orderItems: string[];
    waiterId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  items: {
    foodId: string;
    orderId: string;
    qty: number;
    unitprice: number;
    total: number;
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }[];
}
export interface EditOrder {
  _id: string;
  tableId: string;
  total: number;
  status: string;
  orderItems: string[];
  waiterId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}