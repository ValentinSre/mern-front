import React from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

const ReadEvolution = ({ data }) => {
  return (
    <ComposedChart width={400} height={400} data={data}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis yAxisId='left' />
      <YAxis yAxisId='right' orientation='right' />
      <Tooltip />
      <Legend />

      <Area
        yAxisId='left'
        type='monotone'
        dataKey='pages'
        fill='#ffde59'
        stroke='#ffde59'
      />
      <Bar dataKey='livres' yAxisId='right' barSize={20} fill='#a38e3d' />
      <Line
        yAxisId='right'
        type='monotone'
        dataKey='critique'
        stroke='#fffc76'
      />
    </ComposedChart>
  );
};

export default ReadEvolution;
