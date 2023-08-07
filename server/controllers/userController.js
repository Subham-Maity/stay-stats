const { User } = require("../models/userModel");
const { Hotel } = require("../models/hotelModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getUser = async (req, res) => {
  try {
    console.log("getUser");
    const user = await User.findById(req.body.id).populate({
      path: "hotel",
      model: Hotel,
    });
    if (!user) {
      res.status(200).json({ error: "No user found", user: {} });
      return;
    } else {
      res.status(200).json({ user });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getUsers = async (req, res) => {
  // Some logic to get the user
  try {
    console.log("getUsers");
    let { page, limit, sortBy, sortOrder, location, addedByMe } = req.query;
    page = parseInt(page) ?? 1;
    limit = parseInt(limit) ?? 10;

    let skipIndex = (page - 1) * limit;
    const users = await User.find({ role: "SUBADMIN" })
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (-1)
      .skip(skipIndex)
      .limit(limit)
      .populate({ path: "hotel", model: Hotel });

    let usersCount = await User.countDocuments({ role: "SUBADMIN" });

    if (!users) {
      res.status(200).json({
        error: "No users found",
        users: [],
        usersCount: usersCount ?? 0,
      });
      return;
    } else {
      res.status(200).json({ users, usersCount: usersCount ?? 0 });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const getUsersBySearch = async (req, res) => {
  const { query } = req.query;
  console.log("[get users by search controller: =>]");
  console.log(req.query);
  try {
    const regex = new RegExp(escapeRegex(query), "gi");

    const users = await User.find()
      .or([
        { name: regex }, // Search for forms with name matching the provided regex
        { email: regex }, // Search for forms with email matching the provided regex
        { username: regex }, // Search for forms with username matching the provided regex
      ])
      // .and([formsQuery])    // Additional conditions specified in formsQuery
      // .limit(5)
      .populate({ path: "hotel", model: Hotel });

    if (users.length > 0) {
      res.status(200).json({ users, message: "Users fetched successfully" });
    } else {
      res
        .status(200)
        .json({ users, message: "No result found for this search" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
    throw new Error(error);
  }
};

const createUser = async (req, res) => {
  let { name, username, password, email, phoneNumber, role, hotel } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    hotelIds = hotel.map((hotelId) => new ObjectId(hotelId));
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      phoneNumber,
      email,
      role,
      hotel: hotelIds,
      addedBy: req.user._id,
    });
    const populatedUser = await User.findById(newUser._id).populate({
      path: "hotel",
      model: Hotel,
    })
    res
      .status(200)
      .json({ message: "User created successfully", user: populatedUser });
  } catch (error) {
    console.log("[user controller error:]", error);
    if (error.code === 11000) {
      res.status(201).json({ error: "Username already exists" });
      return;
    }
    res.status(201).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id, phoneNumber, hotel, username, name, email, password } = req.body;
  try {
    console.log("[updateuser controller]");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { phoneNumber, hotel, name, username, email, password: hashedPassword },
      { new: true } // This option returns the updated document after the update is applied
    );

    const populatedUser = await updateUser.populate({path: "hotel", model: Hotel}).execPopulate();


    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: populatedUser });
  } catch (error) {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(200).json({ message: "No user found" });
      return;
    } else {
      res.status(200).json({ message: "User deleted successfully" });
      return;
    }

    //TODO: delete all the bookings of the user
  } catch (error) {
    console.log("[user controller deletion error:]", error);
    res.status(201).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  getUsers,
  getUsersBySearch,
  createUser,
  updateUser,
  deleteUser,
};
