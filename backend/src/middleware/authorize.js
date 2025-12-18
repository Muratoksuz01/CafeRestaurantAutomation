// middleware/authorize.js
const mongoose = require("mongoose");
const redis = require("../redis");
const UserRole = require("../models/UserRole");
module.exports = (actionCode) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const cacheKey = `perm:${userId}:${actionCode}`;

        // 1) Redis bak
        const cached = await redis.get(cacheKey);
        if (cached !== null) {
            console.log("redis have cached this request already");
            
            if (cached === "1") return next();
            return res.sendStatus(403);
        }

        // 2) DB kontrolü
        const hasPermission = await UserRole.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },

            {
                $lookup: {
                    from: "roleactions",
                    localField: "roleId",
                    foreignField: "roleId",
                    as: "roleActions"
                }
            },
            { $unwind: "$roleActions" },

            {
                $lookup: {
                    from: "actions",
                    localField: "roleActions.actionId",
                    foreignField: "_id",
                    as: "action"
                }
            },
            { $unwind: "$action" },

            { $match: { "action.code": actionCode } },

            { $limit: 1 },
            { $project: { _id: 1 } }
        ]);

        const allowed = hasPermission.length > 0;


        // 3) Cache yaz
        await redis.setEx(cacheKey, 600, allowed ? "1" : "0");
        console.log("redis have not cached this request but now wrote");
        
        if (!allowed) return res.sendStatus(403);
        next();
    };
};
