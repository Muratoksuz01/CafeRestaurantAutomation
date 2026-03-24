// src/lib/api.ts
export const API_BASE_URL = "http://localhost:5000";

export const API_PATHS = {
  //auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,

  // getRoles: `${API_BASE_URL}/admin/getRoles`,
  getAdminStats: `${API_BASE_URL}/users/getAdminStats`,
  getPermissions: `${API_BASE_URL}/admin/getPermissions`,

  updateUser:(id:string)=>`${API_BASE_URL}/users/`+id,
  deleteUser: (id: string) => `${API_BASE_URL}/users/` + id,
  getUser:(id:string)=> `${API_BASE_URL}/users/`+id,
  createUser: `${API_BASE_URL}/users`,
  getUsers: `${API_BASE_URL}/users`,
  

  getFoods: `${API_BASE_URL}/food`,
  createFood: `${API_BASE_URL}/food`,
  deleteFood: (id: string) => `${API_BASE_URL}/food/` + id,
  updateFood: (id: string) => `${API_BASE_URL}/food/` + id,

  getCategories: `${API_BASE_URL}/category`,
  createCategory: `${API_BASE_URL}/category`,
  deleteCategory: (id: string) => `${API_BASE_URL}/category/${id}`,
  updateCategory: (id: string) => `${API_BASE_URL}/category/${id}`,
  reassignFoods: (id: string) => `${API_BASE_URL}/category/${id}/reassign`,// categori silinirse yemekler icin yeni kategori belirlemek icin 

  //user
  createTable: `${API_BASE_URL}/table/`,
  getTables: `${API_BASE_URL}/table/`,
  getTable: (id: string) =>`${API_BASE_URL}/table/${id}`,
  editTable: (id: string) => `${API_BASE_URL}/table/${id}`,
  deleteTable: (id: string) => `${API_BASE_URL}/table/${id}`,
  reassignTables: `${API_BASE_URL}/table/reassign`,// categori silinirse yemekler icin yeni kategori belirlemek icin 
  handleBook: (id: string) => `${API_BASE_URL}/table/book/${id}`,
  // order
  createOrder: `${API_BASE_URL}/order`,
  getOrders:`${API_BASE_URL}/order`,
  getOrder:(id:string)=>`${API_BASE_URL}/order/`+id,
  orderbydate:`${API_BASE_URL}/order/getOrders/by-date`,
  updateOrder:(id:string)=>`${API_BASE_URL}/order/`+id,
  editOrder: `${API_BASE_URL}/order/editOrder`,
  deleteOrder: `${API_BASE_URL}/order
  `,
  paidOrder: `${API_BASE_URL}/order/paidOrder`,

};
