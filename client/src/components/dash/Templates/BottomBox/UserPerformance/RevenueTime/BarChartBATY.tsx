import React from "react";
import {
  isWithinInterval,
  subDays,
  startOfYear,
  endOfYear,
} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/UserPerformance/BarChartComponent";

interface RevenueBarChartProps {
  data: {
    userName: string;
    bookingAmount: number;
    createdAt: string;
  }[];
}

const RevenueBarChartBATY: React.FC<RevenueBarChartProps> = ({ data }) => {
  // Calculate the start and end dates for the current year
  const currentDate = new Date();
  const startOfCurrentYear = startOfYear(currentDate);
  const endOfCurrentYear = endOfYear(currentDate);

  // Create a dictionary to aggregate booking amounts for each source within the current year
  const aggregateData: { [key: string]: number } = {};

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    if (isWithinInterval(itemDate, { start: startOfCurrentYear, end: endOfCurrentYear })) {
      const source = item.userName;
      if (aggregateData[source]) {
        aggregateData[source] += item.bookingAmount;
      } else {
        aggregateData[source] = item.bookingAmount;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
      new Set(data.map((item) => item.userName)),
  );

  // Create a chartData array with all unique sources and their aggregated revenue for the current year
  const chartData = uniqueSources.map((source) => ({
    source,
    revenue: aggregateData[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"revenue"} />
  );
};

export default RevenueBarChartBATY;
