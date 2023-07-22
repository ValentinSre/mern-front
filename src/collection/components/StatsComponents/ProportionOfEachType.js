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

const ProportionOfEachType = ({ data }) => {
  const barChartData = Object.keys(data).map((type) => ({
    name: type,
    nombre: data[type],
  }));

  return (
    <BarChart width={350} height={300} data={barChartData}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey='nombre' fill='#ffde59' />
    </BarChart>
  );
};

export default ProportionOfEachType;
