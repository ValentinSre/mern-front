import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const ReadReviewedProportion = ({
  categoryPercentages,
  criticalPercentages,
}) => {
  const data1 = Object.keys(categoryPercentages).map((category) => ({
    category: category,
    percentage: categoryPercentages[category],
  }));

  const data2 = Object.keys(criticalPercentages).map((category) => ({
    category: category,
    percentage: criticalPercentages[category],
  }));

  const COLORS = ["#ffde59", "#d0b32c"];

  // find the percentage of the "Lus" category in data1
  const nonLusPercentage = categoryPercentages["Non lus"];

  // calculate the start and end angle for the second pie based on the "Lus" percentage
  const startAngle = (-nonLusPercentage * 360) / 100;
  const endAngle = -((100 - nonLusPercentage) * 360) / 100 + startAngle;
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    category,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLabel = ({ percent }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <PieChart width={380} height={300}>
      <Tooltip />
      <Pie
        data={data1}
        dataKey='percentage'
        nameKey='category'
        cx='50%'
        cy='50%'
        innerRadius={0}
        outerRadius={80}
        fill='#8884d8'
        label={renderCustomizedLabel}
        labelLine={false}
      >
        {data1.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Pie
        data={data2}
        dataKey='percentage'
        nameKey='category'
        cx='50%'
        cy='50%'
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={85}
        outerRadius={105}
        fill='#82ca9d'
        label={renderLabel}
        labelLine={false}
      >
        {data2.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default ReadReviewedProportion;
