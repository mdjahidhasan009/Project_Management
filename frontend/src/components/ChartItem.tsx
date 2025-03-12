import React from 'react';
import { Chart,  GoogleChartOptions, ReactGoogleChartProps } from "react-google-charts";

type TChartDataType = Array<Array<string | number | Date | null>>;

// Define the props interface for the component
type TChartItemProps = {
    chartData: TChartDataType;
    options?: GoogleChartOptions;
}

const ChartItem: React.FC<TChartItemProps> = ({ chartData }) => {
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
