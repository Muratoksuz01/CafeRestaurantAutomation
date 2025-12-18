// middleware/authorize.js
const mongoose = require("mongoose");
const redis = require("../redis");
const UserRole = require("../models/UserRole");
const Role = require("../models/Role");

module.exports = (roleName) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const cacheKey = `perm:${userId}:${roleName}`;

        // Redis kontrol
        const cached = await redis.get(cacheKey);
        if (cached !== null) {
            if (cached === "1") return next();
            return res.sendStatus(403);
        }

        // Kullanıcının rolü
        const userRole = await UserRole.findOne({ userId });
        if (!userRole) {
            await redis.setEx(cacheKey, 600, "0");
            return res.sendStatus(403);
        }

        const role = await Role.findById(userRole.roleId).select("name");
        if (!role) {
            await redis.setEx(cacheKey, 600, "0");
            return res.sendStatus(403);
        }

        const allowed = role.name === roleName;

        // Cache yaz
        await redis.setEx(cacheKey, 600, allowed ? "1" : "0");

        if (!allowed) return res.sendStatus(403);
        next();
    };
};
