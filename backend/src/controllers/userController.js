const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Kullanıcı kayıt
const register = async (req, res) => {
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
const login = async (req, res) => {
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
      return res.status(201).json({
        success: true,
        message: "Your account is pending admin approval.",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
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
const getProfile = async (req, res) => {
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
};



// Profil güncelleme
const updateProfile = async (req, res) => {
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
};


// Şifre değiştirme
const changePassword = async (req, res) => {
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
};




module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,

};
