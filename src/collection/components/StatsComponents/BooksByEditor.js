import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Define colors for each category

const MyPieChart = ({ loadedCollection }) => {
  // Check if loadedCollection is not available or empty
  if (!loadedCollection || loadedCollection.length === 0) {
    return <div>No data available.</div>;
  }

  const data = {
    Manga: {
      total: 0,
      lu: 0,
      nonLu: 0,
    },
    Comics: {
      total: 0,
      lu: 0,
      nonLu: 0,
    },
    Roman: {
      total: 0,
      lu: 0,
      nonLu: 0,
    },
    BD: {
      total: 0,
      lu: 0,
      nonLu: 0,
    },
  };

  for (const book of loadedCollection) {
    if (book.possede) {
      data[book.type].total++;
      if (book.lu) {
        data[book.type].lu++;
      } else {
        data[book.type].nonLu++;
      }
    }
  }

  // Calculate proportions
  const totalValues = Object.values(data).map((item) => item.total);
  const totalSum = totalValues.reduce((acc, val) => acc + val, 0);
  const proportions = totalValues.map((val) => (val / totalSum) * 100);

  // Construct data for PieChart
  const pieChartData = Object.keys(data).map((category, index) => ({
    name: category,
    value: proportions[index],
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={pieChartData}
        cx={200}
        cy={200}
        outerRadius={80}
        fill='#8884d8'
        dataKey='value'
      >
        {pieChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default MyPieChart;
