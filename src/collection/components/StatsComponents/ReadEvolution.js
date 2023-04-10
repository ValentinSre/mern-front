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
    <ComposedChart width={600} height={400} data={data}>
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
        fill='#8884d8'
        stroke='#8884d8'
      />
      <Bar dataKey='livres' yAxisId='right' barSize={20} fill='#413ea0' />
      <Line
        yAxisId='right'
        type='monotone'
        dataKey='critique'
        stroke='#ff7300'
      />
    </ComposedChart>
  );
};

export default ReadEvolution;
