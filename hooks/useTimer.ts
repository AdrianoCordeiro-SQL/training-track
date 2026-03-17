import { useEffect } from 'react';
import { useWorkoutStore } from '@/store/useWorkoutStore';

export function useTimer() {
  const { isResting, tickTimer } = useWorkoutStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResting) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, tickTimer]);
}