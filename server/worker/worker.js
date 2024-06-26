const axios = require("axios");
const cron = require("node-cron");
const { Booking } = require("../models/bookingModel");
const { Hotel } = require("../models/hotelModel");
const { User } = require("../models/userModel");
const Sequence = require("../models/sequenceModel");
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_WORKER_SECRET;

const getJwtToken = () => {
  return jwt.sign({ secretKey }, secretKey, { expiresIn: "5m" });
};
const startBookingCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Booking cron job started");
    try {
      const allData = await Booking.find({});
      await axios.post("http://localhost:3333/bookings", allData, {
        headers: {
          Authorization: `Bearer ${getJwtToken()}`,
        },
      });
      console.log("Booking data sent successfully");
    } catch (error) {
      console.error("Error sending booking data", error);
    }
  });
};

const startHotelCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Hotel cron job started");
    try {
      const allData = await Hotel.find({});
      await axios.post("http://localhost:3333/hotels", allData, {
        headers: {
          Authorization: `Bearer ${getJwtToken()}`,
        },
      });
      console.log("Hotel data sent successfully");
    } catch (error) {
      console.error("Error sending hotel data", error);
    }
  });
};
const startUserCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("User cron job started");
    try {
      const allData = await User.find({});
      await axios.post("http://localhost:3333/users", allData, {
        headers: {
          Authorization: `Bearer ${getJwtToken()}`,
        },
      });
      console.log("User data sent successfully");
    } catch (error) {
      console.error("Error sending user data", error);
    }
  });
};
const startSequenceCronJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Sequence cron job started");
    try {
      const allData = await Sequence.find({});
      await axios.post("http://localhost:3333/sequences", allData, {
        headers: {
          Authorization: `Bearer ${getJwtToken()}`,
        },
      });
      console.log("Sequence data sent successfully");
    } catch (error) {
      console.error("Error sending sequence data", error);
    }
  });
};
module.exports = {
  startBookingCronJob,
  startHotelCronJob,
  startUserCronJob,
  startSequenceCronJob,
};
