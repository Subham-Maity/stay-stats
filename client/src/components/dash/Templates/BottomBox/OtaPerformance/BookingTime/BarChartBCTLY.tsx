import React from "react";
import {
  isWithinInterval,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/OtaPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    bookingSource: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartPreviousYear: React.FC<BookingCountBarChartProps> = ({
                                                                                 data,
                                                                               }) => {
  // Calculate the start and end dates for the previous year
  const currentDate = new Date();
  const startOfPreviousYear = startOfYear(subYears(currentDate, 1));
  const endOfPreviousYear = endOfYear(subYears(currentDate, 1));

  // Create a dictionary to count the number of bookings for each source within the previous year
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfPreviousYear, end: endOfPreviousYear })) {
      const source = item.bookingSource;
      if (bookingCounts[source]) {
        bookingCounts[source]++;
      } else {
        bookingCounts[source] = 1;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.bookingSource)),
  );

  // Create a chartData array with all unique sources and their booking counts for the previous year
  const chartData = uniqueSources.map((source) => ({
    source,
    bookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"bookingCount"} />
  );
};

export default BookingCountBarChartPreviousYear;
