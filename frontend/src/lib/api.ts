// src/lib/api.ts
export const API_BASE_URL = "http://localhost:5000/api";

export const API_PATHS = {
  //auth
  login: `${API_BASE_URL}/users/login`,
  register: `${API_BASE_URL}/users/register`,
  getUser: `${API_BASE_URL}/users/profile`,
  // admin
  getUsers: `${API_BASE_URL}/admin/getUsers`


};
