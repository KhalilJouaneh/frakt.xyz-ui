import { useEffect, useState } from 'react';

interface UseWindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): UseWindowSize => {
  const [windowSize, setWindowSize] = useState<UseWindowSize>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};
