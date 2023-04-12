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
    <AreaChart width={390} height={300} data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Area type='monotone' dataKey='total' stroke='#ffde59' fill='#ffde59' />
    </AreaChart>
  );
};

export default AmountEvolution;
