import React from 'react';
import { Chart } from "react-google-charts";

const ChartItem = ({ chartData }) => {
  return (
      <Chart
          width={'100%'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            legend: { position : "bottom" },
            hAxis: {
              title: 'Time',
            },
            vAxis: {
              title: 'Finished todo and fixed bug count',
            },
            series: {
              1: { curveType: 'none' },
            },
          }}
      />
  )
}

export default ChartItem;
