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
    <BarChart width={380} height={300} data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='precVal' fill='#d0b32c' />
      <Bar dataKey='valeur' fill='#ffde59' />
    </BarChart>
  );
};

export default BoughtBooksByMonthComparison;
