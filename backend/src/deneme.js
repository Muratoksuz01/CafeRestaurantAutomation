require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Role = require("./models/Role");
const Action = require("./models/action");
const UserRole = require("./models/UserRole");
const RoleAction = require("./models/RoleAction");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  /*  const roles = await Role.insertMany([
       { name: "Yonetici" },
       { name: "Garson" },
       { name: "Kasiyer" },
       { name: "Asci" }
   ]);

   const roleMap = Object.fromEntries(
       roles.map(r => [r.name, r])
   );

   const actions = await Action.insertMany([
       { code: "Food.Create", description: "Yemek ekleme" },
       { code: "Food.Update", description: "Yemek güncelleme" },
       { code: "Food.Delete", description: "Yemek silme" },

       { code: "Category.Create", description: "Category ekleme" },
       { code: "Category.Update", description: "Category güncelleme" },
       { code: "Category.Delete", description: "Category silme" },

       { code: "Order.View", description: "Sipariş görüntüleme" },
       { code: "Order.Create", description: "Order ekleme" },
       { code: "Order.Update", description: "Order güncelleme" },
       { code: "Order.Delete", description: "Order silme" },
       { code: "Order.Paid", description: "Odeme alma" },

       { code: "Table.View", description: "Masa görüntüleme" },
       { code: "Table.Create", description: "Table ekleme" },
       { code: "Table.Update", description: "Table güncelleme" },
       { code: "Table.Delete", description: "Table silme" },
   ]);


   const adminRoleActions = actions.map(a => ({
       roleId: roleMap["Yonetici"]._id,
       actionId: a._id
   }));

   const garsonRoleActions = actions
       .filter(a =>
           ["Order.Create", "Order.View", "Table.View"].includes(a.code)
       )
       .map(a => ({
           roleId: roleMap["Garson"]._id,
           actionId: a._id
       }));

   await RoleAction.insertMany([
       ...adminRoleActions,
       ...garsonRoleActions
   ]);

   let adminUser = await User.findOne({ email: "admin@kafe.com" });

   if (!adminUser) {
       adminUser = await User.create({
           firstName: "Yonetici",
           lastName: "Admin",
           email: "admin@kafe.com",
           password: "123456",
           isActive: true
       });
   }

   await UserRole.create({
       userId: adminUser._id,
       roleId: roleMap["Yonetici"]._id
   });

   console.log("Seed tamamlandı");
   process.exit(0); */


   /* 
  const garsonRole = await Role.findOne({ name: "Garson" });
 if (!garsonRole) {
   console.log("Garson rolü yok");
   process.exit(1);
 }

 // Garson user
 let garsonUser = await User.findOne({ email: "garson@kafe.com" });
 if (!garsonUser) {
   garsonUser = await User.create({
     firstName: "Garson",
     lastName: "Test",
     email: "garson@kafe.com",
     password: "123456",
     isActive: true
   });
 }


  const actions = await Action.find({
    code: { $in: ["Table.View","Order.Create","Order.Update","Order.Delete"] }
  });
   // role_actions
  await RoleAction.insertMany(
    actions.map(a => ({
      roleId: garsonRole._id,
      actionId: a._id
    }))
  );

 // UserRole varsa tekrar ekleme
 const exists = await UserRole.findOne({
   userId: garsonUser._id,
   roleId: garsonRole._id
 });

 if (!exists) {
   await UserRole.create({
     userId: garsonUser._id,
     roleId: garsonRole._id
   });
 }

 console.log("Garson user hazır:", garsonUser.email);
 process.exit(0); */
 
 /*   // Kasiyer user
   let kasiyerUser = await User.findOne({ email: "kasiyer@kafe.com" });
   if (!kasiyerUser) {
     kasiyerUser = await User.create({
       firstName: "Kasiyer",
       lastName: "Test",
       email: "kasiyer@kafe.com",
       password: "123456",
       isActive: true
     });
   }
 
   // action’lar
   const actions = await Action.find({
     code: { $in: ["Order.View", "Order.Paid","Order.Delete","Order.Update","Order.Create"] }
   });
 
   const kasiyerRole = await Role.findOne({ name: "Kasiyer" });
   if (!kasiyerRole) {
     console.log("Kasiyer rolü yok");
     process.exit(1);
   }
   // role_actions
   await RoleAction.insertMany(
     actions.map(a => ({
       roleId: kasiyerRole._id,
       actionId: a._id
     }))
   );
 
 
   // UserRole bağla (varsa geç)
   const exists = await UserRole.findOne({
     userId: kasiyerUser._id,
     roleId: kasiyerRole._id
   });
 
   if (!exists) {
     await UserRole.create({
       userId: kasiyerUser._id,
       roleId: kasiyerRole._id
     });
   }
 
   console.log("Kasiyer user hazır:", kasiyerUser.email);
   process.exit(0);
     */


const actions = await Action.insertMany([
       { code: "User.Create", description: "Kullanıcı ekleme" },
       { code: "User.Update", description: "Kullanıcı güncelleme" },
       { code: "User.Delete", description: "Kullanıcı silme" },
       { code: "User.View", description: "Kullanıcı Görüntüleme" },

      
   ]);
  let user=await User.findById("69410a4e2737ced4a012434b")
  let role=await UserRole.findOne({userId:user._id})
 
   await RoleAction.insertMany(
    actions.map(a => ({
      roleId: role.roleId,
      actionId: a._id
    }))
  );
 console.log("first")
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
