import React from "react";
import {
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/LocationPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    locationName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCTM: React.FC<BookingCountBarChartProps> = ({
                                                                         data,
                                                                       }) => {
  // Calculate the start and end dates for the current month
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // Create a dictionary to count the number of bookings for each source within the month
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
      const source = item.locationName;
      if (bookingCounts[source]) {
        bookingCounts[source]++;
      } else {
        bookingCounts[source] = 1;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.locationName)),
  );

  // Create a chartData array with all unique sources and their booking counts for the current month
  const chartData = uniqueSources.map((source) => ({
    source,
    bookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"bookingCount"} />
  );
};

export default BookingCountBarChartBCTM;
