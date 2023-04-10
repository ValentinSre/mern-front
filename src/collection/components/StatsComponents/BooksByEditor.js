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

const BooksByEditor = ({ data }) => {
  return (
    <BarChart
      width={800}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='editeur' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='total' stackId='a' fill='#8884d8' />
      <Bar dataKey='lu' stackId='a' fill='#82ca9d' />
    </BarChart>
  );
};

export default BooksByEditor;
