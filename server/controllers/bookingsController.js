const { Booking } = require("../models/bookingModel");

const getBooking = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(200).json({ error: "No booking found", booking: {} });
      return;
    } else {
      res.status(200).json({ booking });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    console.time("get bookings");

    // Fetch all bookings
    const bookings = await Booking.find().populate('hotel');

    console.timeEnd("get bookings");

    if (!bookings || bookings.length === 0) {
      res.status(200).json({ error: "No bookings found", bookings: [] });
      return;
    } else {
      res.status(200).json({ bookings });
      return;
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createBooking = async (req, res) => {
  const {
    hotel,
    guestName,
    checkInDate,
    checkOutDate,
    roomCategory,
    numberOfRooms,
    numberOfPersons,
    bookingAmount,
    advanceAmount,
    dueAmount,
    advanceDate,
    bookingSource,
    bookingBy,
    plan,
    contactNumber,
    remarks,
  } = req.body;
  try {
    const newBooking = await Booking.create({
      hotel,
      guestName,
      checkInDate,
      checkOutDate,
      roomCategory,
      numberOfRooms,
      numberOfPersons,
      bookingAmount,
      advanceAmount,
      dueAmount,
      advanceDate,
      bookingSource,
      bookingBy,
      plan,
      contactNumber,
      remarks,
      addedBy: req.user._id,
    });
    if (!newBooking) {
      res.status(201).json({ message: "Booking not created", booking: {} });
      return;
    }
    res
      .status(200)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const updateBooking = async (req, res) => {
  const {
    id,
    guestName,
    checkInDate,
    checkOutDate,
    roomCategory,
    numberOfRooms,
    numberOfPersons,
    bookingAmount,
    advanceAmount,
    dueAmount,
    advanceDate,
    bookingSource,
    bookingBy,
    plan,
    contactNumber,
    remarks,
  } = req.body;
  try {
    console.log("[updateuser controller]");
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { guestName, checkInDate, checkOutDate, roomCategory, numberOfRooms, numberOfPersons, bookingAmount, advanceAmount, dueAmount, advanceDate, bookingSource, bookingBy, plan, contactNumber, remarks},
      { new: true } // This option returns the updated document after the update is applied
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking updated successfully", user: updateBooking });
  } catch (error) {
    console.log("[user controller update error:]", error);
    res.status(201).json({ error: error.message });
  }
};

const deleteBooking = (req, res) => {
  // EOD
};

module.exports = {
  getBooking,
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
};
