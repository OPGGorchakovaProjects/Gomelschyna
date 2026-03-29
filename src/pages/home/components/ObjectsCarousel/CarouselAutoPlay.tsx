import { useEffect, useRef } from 'react';
import { CarouselAutoPlayProps } from '@utils';

export const CarouselAutoPlay = ({
  onNext,
  isPaused,
  interval,
}: CarouselAutoPlayProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          onNext();
        }
      }, interval);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onNext, interval, isPaused]);

  return null;
};
