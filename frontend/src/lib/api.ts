// src/lib/api.ts
export const API_BASE_URL = "http://localhost:5000/api";

export const API_PATHS = {
  //auth
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  //getUser: `${API_BASE_URL}/auth/profile`,
  // permission: `${API_BASE_URL}/auth/me/permissions`,
  // admin
  getUsers: `${API_BASE_URL}/admin/getUsers`,
  getRoles: `${API_BASE_URL}/admin/getRoles`,
  createUser: `${API_BASE_URL}/admin/createUser`,
  getUser:(id:string)=> `${API_BASE_URL}/admin/getUser/`+id,
  giveApproach: (id: string) => `${API_BASE_URL}/admin/giveAproach/` + id,
  deleteUser: (id: string) => `${API_BASE_URL}/admin/deleteUser/` + id,
  giveReject: (id: string) => `${API_BASE_URL}/admin/giveReject/` + id,
  getAdminStats: `${API_BASE_URL}/admin/getAdminStats`,
  getPermissions: `${API_BASE_URL}/admin/getPermissions`,
  updatePermission:(id:string)=>`${API_BASE_URL}/admin/updatePermission/`+id,
  updateUser:(id:string)=>`${API_BASE_URL}/admin/updateUser/`+id,
  

  getFoods: `${API_BASE_URL}/admin/food`,
  createFood: `${API_BASE_URL}/admin/food`,
  deleteFood: (id: string) => `${API_BASE_URL}/admin/food/` + id,
  updateFood: (id: string) => `${API_BASE_URL}/admin/food/` + id,

  getCategories: `${API_BASE_URL}/admin/categories`,
  createCategory: `${API_BASE_URL}/admin/category`,
  deleteCategory: (id: string) => `${API_BASE_URL}/admin/category/${id}`,
  updateCategory: (id: string) => `${API_BASE_URL}/admin/category/${id}`,
  reassignFoods: (id: string) => `${API_BASE_URL}/admin/categories/${id}/reassign`,// categori silinirse yemekler icin yeni kategori belirlemek icin 

  //user
  createTable: `${API_BASE_URL}/user/createTable`,
  getTables: `${API_BASE_URL}/user/getTables`,
  getTable: `${API_BASE_URL}/user/getTable`,
  editTable: (id: string) => `${API_BASE_URL}/user/editTable/${id}`,
  deleteTable: (id: string) => `${API_BASE_URL}/user/deleteTable/${id}`,
  reassignTables: `${API_BASE_URL}/user/reassign`,// categori silinirse yemekler icin yeni kategori belirlemek icin 
  handleBook: (id: string) => `${API_BASE_URL}/user/book/${id}`,
  // order
  createOrder: `${API_BASE_URL}/user/createOrder`,
  getOrders:`${API_BASE_URL}/user/getOrders`,
  getOrder:(id:string)=>`${API_BASE_URL}/user/getOrder/`+id,
  orderbydate:`${API_BASE_URL}/user/getOrders/by-date`,
  updateOrder:(id:string)=>`${API_BASE_URL}/user/updateOrder/`+id,
  editOrder: `${API_BASE_URL}/user/editOrder`,
  deleteOrder: `${API_BASE_URL}/user/deleteOrder`,
  paidOrder: `${API_BASE_URL}/user/paidOrder`,
  //location
  getLocations: `${API_BASE_URL}/user/getLocations`,
  createLocation: `${API_BASE_URL}/user/createLocation`,
  updateLocation: (id: string) => `${API_BASE_URL}/user/updateLocation/${id}`,
  deleteLocation: (id: string) => `${API_BASE_URL}/user/deleteLocation/${id}`,
};
