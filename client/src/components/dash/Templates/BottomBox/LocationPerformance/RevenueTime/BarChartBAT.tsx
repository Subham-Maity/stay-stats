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

interface RevenueBarChartProps {
  data: {
    locationName: string;
    bookingAmount: number;
    createdAt: string;
  }[];
}

const RevenueBarChartRBT: React.FC<RevenueBarChartProps> = ({ data }) => {
  // Create a dictionary to aggregate booking amounts for each source
  const aggregateData: { [key: string]: number } = {};

  data.forEach((item) => {
    if (isSameDay(new Date(item.createdAt), new Date())) {
      const source = item.locationName;
      if (aggregateData[source]) {
        aggregateData[source] += item.bookingAmount;
      } else {
        aggregateData[source] = item.bookingAmount;
      }
    }
  });

  // Create an array with unique booking sources
  const uniqueSources = Array.from(
    new Set(data.map((item) => item.locationName)),
  );

  // Create a chartData array with all unique sources and their aggregated revenue for today
  const chartData = uniqueSources.map((source) => ({
    source,
    revenue: aggregateData[source] || 0,
  }));

  return (
      <BarChartComponent chartData={chartData} type={"revenue"} />
  );
};

export default RevenueBarChartRBT;
