// permissions.map.js
module.exports = {
  // TABLE
  "GET /getTables": "Table.View",
  "POST /tables": "Table.Create",
  "PUT /tables/:id": "Table.Update",
  "DELETE /tables/:id": "Table.Delete",

  // FOOD
  "POST /foods": "Food.Create",
  "PUT /foods/:id": "Food.Update",
  "DELETE /foods/:id": "Food.Delete",

  // CATEGORY
  "POST /categories": "Category.Create",
  "PUT /categories/:id": "Category.Update",
  "DELETE /categories/:id": "Category.Delete",

  // ORDER
  "GET /orders": "Order.View",
  "POST /orders": "Order.Create",
  "PUT /orders/:id": "Order.Update",
  "DELETE /orders/:id": "Order.Delete",
  "POST /orders/:id/paid": "Order.Paid",
  
  // USERS
"GET /getUsers": "User.View",
"GET /getUser/:id": "User.View",
"PUT /giveAproach/:id": "User.Update",
"PUT /giveReject/:id": "User.Update",
"PUT /updateUser/:id": "User.Update",
"PUT /updatePermission/:id": "User.Update",
"DELETE /deleteUser/:id": "User.Delete",
"GET /getRoles": "User.View",
"GET /getPermissions": "User.View",
"GET /getAdminStats": "User.View",

};