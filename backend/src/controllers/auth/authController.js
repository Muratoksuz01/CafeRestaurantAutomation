const User = require('../../models/User');
const { generateToken } = require('../../middleware/auth');
const redis = require("../../redis");
const UserRole = require("../../models/UserRole");
// const RoleAction = require("../../models/RoleAction");
const Role = require("../../models/Role");

// Kullanıcı kayıt
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, adminCode } =
      req.body;

    // Email veya username var mı?
    const existingUser = await User.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }
    let isAdmin = adminCode == process.env.ADMIN_CODE
    // Kullanıcı oluştur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      isActive: isAdmin ? true : null, // admin onayı bekliyor
      role: isAdmin ? "admin" : "user"
    });

    const token = generateToken(user._id);
    if (isAdmin) {

      res.status(201).json({
        success: true,
        message:
          "You registered successfully. ",
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
          },
          token
        },
      });
    } else {
      res.status(201).json({
        success: true,
        message:
          "You registered successfully. Your account is pending admin approval.",
        data: {},
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Kullanıcı giriş
exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;

    // Email ile kullanıcı bul
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Şifre doğrula
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Hesap aktif mi?
     if (!user.isActive) {
        return res.status(403).json({
          success: true,
          message: "Your account is pending admin approval.",
        });
      } 

    const userRole = await UserRole
      .findOne({ userId:user._id })
      .populate("roleId", "name");

    const roleName = userRole?.roleId?.name;
    console.log(roleName);

    const token = generateToken(user._id, roleName);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          //   role: user.role,
          phoneNumber: user.phoneNumber,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Profil bilgilerini getir
/* const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}; */


/* exports.permissions = async (req, res) => {
  const userId = req.user.id;

  // Redis varsa direkt dön
  const cached = await redis.get(`perm:list:${userId}`);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // DB’den çek
  const roles = await UserRole.find({ userId }).select("roleId");

  const roleActions = await RoleAction.find({
    roleId: { $in: roles.map(r => r.roleId) }
  }).populate("actionId");

  const permissions = [
    ...new Set(roleActions.map(ra => ra.actionId.code))
  ];

  await redis.setEx(
    `perm:list:${userId}`,
    600,
    JSON.stringify(permissions)
  );

  res.json({ success: true, data: permissions });
} */

// Profil güncelleme
/* exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
    ];

    const updateData = {};

    allowed.forEach((field) => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}; */
// Şifre değiştirme
/* exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    //                                                              front da old ve new esit olmadıgını dogrula 
    // en az 6 akrakter oldugunu doggrula 
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}; */



