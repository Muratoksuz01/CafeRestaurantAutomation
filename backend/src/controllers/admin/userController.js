const User = require('../../models/User');





const giveAproach = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = true;
  await user.save();

  return res.json({ success: true, message: "User approved" });
};
const giveReject = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.isActive = false;
  await user.save();

  return res.json({ success: true, message: "User rejected" });
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await User.findByIdAndDelete(id);

  return res.json({ success: true, message: "User deleted" });
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: { $in: [false, null] } });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  getUsers,
  giveAproach,
  deleteUser,
  giveReject,
};