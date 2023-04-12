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
      <Bar dataKey='precVal' fill='#0cc0df' />
      <Bar dataKey='valeur' fill='#0097b2' />
    </BarChart>
  );
};

export default BoughtBooksByMonthComparison;
