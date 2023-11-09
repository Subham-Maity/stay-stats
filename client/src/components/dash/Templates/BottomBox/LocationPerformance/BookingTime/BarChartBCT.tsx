import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, isSameDay } from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/LocationPerformance/BarChartComponent";

interface BookingCountBarChartProps {
  data: {
    locationName: string;
    createdAt: string;
  }[];
}

const BookingCountBarChartBCT: React.FC<BookingCountBarChartProps> = ({
  data,
}) => {
  // Create a dictionary to count the number of bookings for each source
  const bookingCounts: { [key: string]: number } = {};

  data.forEach((item) => {
    if (isSameDay(new Date(item.createdAt), new Date())) {
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

  // Create a chartData array with all unique sources and their booking counts for today
  const chartData = uniqueSources.map((source) => ({
    source,
    bookingCount: bookingCounts[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"bookingCount"} />
  );
};

export default BookingCountBarChartBCT;
