import { useEffect, useRef } from "react";

export const useSaleTimer = (
  interval: number,
  initialDelay: number,
  callback: () => void
) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const initialDelayTimer = setTimeout(() => {
      timerRef.current = setInterval(callback, interval);
      callback();
    }, initialDelay);

    // Cleanup function
    return () => {
      clearTimeout(initialDelayTimer);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return timerRef.current;
};
