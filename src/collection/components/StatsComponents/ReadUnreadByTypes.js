import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#d0b32c", "#ffde59"]; // Define colors for "lu" and "nonLu"

const BoughtBooksByCategoryComparison = ({ data }) => {
  const barChartData = Object.keys(data).map((category) => ({
    name: category,
    lu: data[category].lu,
    nonLu: data[category].nonLu,
  }));

  return (
    <BarChart width={350} height={300} data={barChartData} barCategoryGap={20}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='lu' fill={COLORS[0]} />
      <Bar dataKey='nonLu' fill={COLORS[1]} />
    </BarChart>
  );
};

export default BoughtBooksByCategoryComparison;
