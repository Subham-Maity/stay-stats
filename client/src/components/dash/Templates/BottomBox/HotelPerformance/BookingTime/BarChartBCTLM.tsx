import React from "react";

import {
  format,
  isWithinInterval,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/HotelPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    hotelName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCTM: React.FC<BookingCountBarChartProps> = ({
                                                                         data,
                                                                       }) => {
  // Calculate the start and end dates for the previous month
  const currentDate = new Date();
  const startOfPreviousMonth = startOfMonth(subMonths(currentDate, 1));
  const endOfPreviousMonth = endOfMonth(subMonths(currentDate, 1));

  // Create a dictionary to count the number of bookings for each source within the previous month
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfPreviousMonth, end: endOfPreviousMonth })) {
      const source = item.hotelName;
      if (bookingCounts[source]) {
        bookingCounts[source]++;
      } else {
        bookingCounts[source] = 1;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.hotelName)),
  );

  // Create a chartData array with all unique sources and their booking counts for the previous month
  const chartData = uniqueSources.map((source) => ({
    source,
    bookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"bookingCount"} />
  );
};

export default BookingCountBarChartBCTM;
