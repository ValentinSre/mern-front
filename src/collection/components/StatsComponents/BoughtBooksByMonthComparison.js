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

const BoughtBooksByMonthComparison = ({ data }) => {
  return (
    <BarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='valeur' fill='#8884d8' />
      <Bar dataKey='precVal' fill='#82ca9d' />
    </BarChart>
  );
};

export default BoughtBooksByMonthComparison;
