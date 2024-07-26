import { useState, useEffect } from 'react';

type Callback = (...args: any[]) => void;

function debounce(fn: Callback, ms: number): (...args: any[]) => void {
  let timer: ReturnType<typeof setTimeout> | null;
  return function(...args: any[]): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
}


interface WindowSize {
  width: number | any;
  height: number | any;
}


export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {

    const handleResize: Callback = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 250); 

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
