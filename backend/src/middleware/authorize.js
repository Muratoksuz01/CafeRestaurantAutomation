// middleware/authorize.js
const mongoose = require("mongoose");
// const redis = require("../redis");
const UserRole = require("../models/UserRole");
const Role = require("../models/Role");

const allowedRoles = ["Yonetici", "Kasiyer", "Garson"];
module.exports = (roleName) => {
    if (!allowedRoles.includes(roleName)) {
        throw new Error(`Hatalı Rol: "${roleName}" tanımlanamaz. Geçerli roller: ${allowedRoles.join(", ")}`);
    }
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            console.log("middle:userıd:",userId)
            // 1. Kullanıcının rol ID'sini bul (await ekledik)
            const userRoleDoc = await UserRole.findOne({ userId }).select("roleId");
            
            if (!userRoleDoc) {
                return res.status(403).json({ message: "Kullanıcıya atanmış bir rol bulunamadı." });
            }

            // 2. Rolün ismini bul (await ekledik)
            const role = await Role.findById(userRoleDoc.roleId).select("name");
            console.log("middle:rolename:",role?.name)
            if (!role || role.name !== roleName) {
                return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
            }

            next();
        } catch (error) {
            console.error("Yetkilendirme hatası:", error);
            res.status(500).json({ message: "Sunucu hatası." });
        }
    };
};