export interface IPrinter {
  printOrder(orderData: any): Promise<boolean>;
}