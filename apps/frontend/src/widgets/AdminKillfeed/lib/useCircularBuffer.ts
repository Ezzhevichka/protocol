'use client';

import { useState, useCallback } from 'react';

type CircularBufferResult<T> = {
  items: T[];
  total: number;
  push: (item: T) => void;
  clear: () => void;
};

export function useCircularBuffer<T>(max: number): CircularBufferResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  const push = useCallback((item: T) => {
    setItems((prev) => {
      const next = [item, ...prev];
      return next.length > max ? next.slice(0, max) : next;
    });
    setTotal((n) => n + 1);
  }, [max]);

  const clear = useCallback(() => {
    setItems([]);
    setTotal(0);
  }, []);

  return { items, total, push, clear };
}
