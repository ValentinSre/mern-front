import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const BooksByEditor = ({ data }) => {
  return (
    <BarChart
      width={380}
      height={400}
      data={data}
      margin={{
        top: 5,
        left: 20,
        bottom: 5,
      }}
      layout='vertical'
      barSize={10} // définir la largeur des barres
    >
      <XAxis type='number' />
      <YAxis dataKey='editeur' type='category' />
      <Tooltip />
      <Bar dataKey='total' stackId='a' fill='#0097b2' />
      {/* <Bar dataKey='lu' stackId='a' fill='#82ca9d' /> */}
    </BarChart>
  );
};

export default BooksByEditor;
