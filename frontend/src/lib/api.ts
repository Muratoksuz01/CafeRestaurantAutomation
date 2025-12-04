// src/lib/api.ts
export const API_BASE_URL = "http://localhost:5000/api";

export const API_PATHS = {
  //auth
  login: `${API_BASE_URL}/users/login`,
  register: `${API_BASE_URL}/users/register`,
  getUser: `${API_BASE_URL}/users/profile`,
  // admin
  getUsers: `${API_BASE_URL}/admin/getUsers`,
  giveApproach: (id: string) => `${API_BASE_URL}/admin/giveAproach/` + id,
  deleteUser: (id: string) => `${API_BASE_URL}/admin/deleteUser/` + id,
  giveReject: (id: string) => `${API_BASE_URL}/admin/giveReject/` + id,

  getFoods: `${API_BASE_URL}/admin/foods`,
  createFood: `${API_BASE_URL}/admin/food`,
  deleteFood: (id: string) => `${API_BASE_URL}/admin/food/` + id,
  updateFood: (id: string) => `${API_BASE_URL}/admin/food/` + id,

  getCategories: `${API_BASE_URL}/admin/categories`,
  createCategory: `${API_BASE_URL}/admin/category`,
  deleteCategory: (id: string) => `${API_BASE_URL}/admin/category/${id}`,
  updateCategory: (id: string) => `${API_BASE_URL}/admin/category/${id}`,

  reassignFoods: (id:string) => `${API_BASE_URL}/admin/categories/${id}/reassign`,


};
