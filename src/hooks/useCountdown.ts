import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useSolanaTimestamp } from './useSolanaTimestamp';

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

type UseCountdown = (endTime: number) => {
  timeLeft: TimeLeft;
  leftTimeInSeconds: number;
};

export const useCountdown: UseCountdown = (endTime: number) => {
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const solanaTimestamp = useSolanaTimestamp();

  const formatDateUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  const endTimeMoment = moment.unix(endTime);
  const timeDifference = moment.duration(
    endTimeMoment.diff(moment.unix(currentTime)),
  );

  useEffect(() => {
    if (solanaTimestamp) {
      setCurrentTime(solanaTimestamp);

      intervalIdRef.current = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [solanaTimestamp]);

  useEffect(() => {
    timeDifference.asSeconds() < 0 && clearInterval(intervalIdRef.current);
  }, [timeDifference]);

  const isExpired = timeDifference.asSeconds() < 0;

  return {
    timeLeft: {
      days: isExpired ? '0' : formatDateUnit(timeDifference.days()),
      hours: isExpired ? '0' : formatDateUnit(timeDifference.hours()),
      minutes: isExpired ? '0' : formatDateUnit(timeDifference.minutes()),
      seconds: isExpired ? '0' : formatDateUnit(timeDifference.seconds()),
    },
    leftTimeInSeconds: isExpired ? 0 : timeDifference.asSeconds(),
  };
};
