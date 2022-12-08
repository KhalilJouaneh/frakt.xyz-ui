import { useCountdown } from '@frakt/hooks';
import moment from 'moment';

export const createTimerJSX = (expiredAt: string | number): JSX.Element => {
  const { timeLeft } = useCountdown(moment(expiredAt).unix());

  return (
    <>
      {timeLeft.days}d<p>:</p>
      {timeLeft.hours}h<p>:</p>
      {timeLeft.minutes}m
    </>
  );
};
