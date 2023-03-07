import { useCountdown } from '@frakt/hooks';
import moment from 'moment';
import { FC } from 'react';

interface CreateTimerProps {
  expiredAt: string | number;
  isSecondType?: boolean;
}

export const createTimerJSX: FC<CreateTimerProps> = ({
  expiredAt,
  isSecondType,
}): JSX.Element => {
  const { timeLeft } = useCountdown(moment(expiredAt).unix());

  return (
    <>
      {!isSecondType ? (
        <>
          {timeLeft.days}d<p>:</p>
          {timeLeft.hours}h<p>:</p>
          {timeLeft.minutes}m
        </>
      ) : (
        <>
          {timeLeft.minutes}m<p>:</p>
          {timeLeft.seconds}s
        </>
      )}
    </>
  );
};
