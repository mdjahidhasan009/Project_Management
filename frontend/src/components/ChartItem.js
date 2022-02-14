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
            legend: { position : "bottom"},
            hAxis: {
              title: 'Todo done and bug fixed',
            },
            vAxis: {
              title: 'Time',
            },
            series: {
              1: { curveType: 'function' },
            },
          }}
          rootProps={{ 'data-testid': '2' }}
      />
  )
}

export default ChartItem;
