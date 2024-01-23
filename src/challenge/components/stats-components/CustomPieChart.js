import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const CustomPieChart = ({ dataKey, pourcentage }) => {
  const data = [
    { name: "Vu", value: pourcentage },
    { name: "Restant", value: 100 - pourcentage },
  ];

  const COLORS = ["#ffde59", "#d0b32c"];

  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        cx={150}
        cy={110}
        outerRadius={60}
        fill='#d0b32c'
        dataKey='value'
        label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
          const RADIAN = Math.PI / 180;
          const radius = 25 + innerRadius + (outerRadius - innerRadius);
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill='#d0b32c'
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline='central'
            >
              {`${value.toFixed(2)}%`}
            </text>
          );
        }}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend verticalAlign='bottom' height={36} />
    </PieChart>
  );
};

export default CustomPieChart;
