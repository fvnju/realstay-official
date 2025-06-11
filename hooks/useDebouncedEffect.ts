import { useEffect, useRef } from 'react';

/**
 * Debounce a function call
 * @param callback The function to debounce
 * @param delay Delay in milliseconds
 * @param deps Dependencies to trigger the effect
 */
export function useDebouncedEffect(callback: () => void, delay: number, deps: any[]) {
  const handler = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (handler.current) {
      clearTimeout(handler.current);
    }
    handler.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
