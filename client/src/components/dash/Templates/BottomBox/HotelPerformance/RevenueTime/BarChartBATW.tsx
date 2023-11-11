import React from "react";
import {isWithinInterval, startOfWeek, endOfWeek} from "date-fns";
import BarChartComponent from "@/components/dash/Templates/BottomBox/HotelPerformance/BarChartComponent";

interface RevenueBarChartProps {
    data: {
        hotelName: string;
        bookingAmount: number;
        createdAt: string;
    }[];
}

const RevenueBarChartBATW: React.FC<RevenueBarChartProps> = ({data}) => {
    // Calculate the start and end dates for the current week
    const currentDate = new Date();
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);

    // Create a dictionary to aggregate booking amounts for each source within the week
    const aggregateData: { [key: string]: number } = {};

    data.forEach((item) => {
        const itemDate = new Date(item.createdAt);
        if (isWithinInterval(itemDate, {start: startDate, end: endDate})) {
            const source = item.hotelName;
            if (aggregateData[source]) {
                aggregateData[source] += item.bookingAmount;
            } else {
                aggregateData[source] = item.bookingAmount;
            }
        }
    });

    // Create an array with unique booking sources
    const uniqueSources = Array.from(
        new Set(data.map((item) => item.hotelName)),
    );

    // Create a chartData array with all unique sources and their aggregated revenue for the week
    const chartData = uniqueSources.map((source) => ({
        source,
        revenue: aggregateData[source] || 0,
    }));

    return (
        <BarChartComponent chartData={chartData} type={"revenue"}/>
    );
};

export default RevenueBarChartBATW;
