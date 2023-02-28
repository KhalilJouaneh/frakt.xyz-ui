import { FC, ReactNode } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const defaultColors = ['#FFC01F', '#1FAEFF', '#FF701F', '#1FFF50'];

interface ChartPieProps {
  rawData?: any[];
  colors?: string[];
  width?: number;
  label?: ReactNode;
}

export const ChartPie: FC<ChartPieProps> = ({
  rawData,
  colors,
  label,
  width,
}) => {
  const options = { maintainAspectRatio: false };

  const data = {
    datasets: [
      {
        data: rawData,
        backgroundColor: colors?.length ? colors : defaultColors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <Doughnut data={data} options={options} width={width} />
      {label}
    </>
  );
};
