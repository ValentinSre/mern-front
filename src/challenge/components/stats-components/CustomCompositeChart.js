import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
} from "recharts";

const CustomCompositeChart = ({
  semaineProgression,
  moyenneMinutesAvoirParSemaine,
  watchtimeIdealProgression,
}) => {
  const data = semaineProgression?.map((value, index) => ({
    semaine: index + 1,
    progression: value,
    progressionIdeale: watchtimeIdealProgression[index],
  }));

  return (
    <ResponsiveContainer width={400} height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey='semaine' />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Area
          type='monotone'
          dataKey='progressionIdeale'
          fill='#ffde59'
          stroke='#ffde59'
        />
        <Area
          type='monotone'
          dataKey='progression'
          fill='#d0b32c'
          stroke='#d0b32c'
        />
        <ReferenceLine y={moyenneMinutesAvoirParSemaine} stroke='#FF0000' />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomCompositeChart;
