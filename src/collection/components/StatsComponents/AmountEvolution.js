import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AmountEvolution = ({ data }) => {
  return (
    <AreaChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type='monotone' dataKey='total' stroke='#8884d8' fill='#8884d8' />
    </AreaChart>
  );
};

export default AmountEvolution;
