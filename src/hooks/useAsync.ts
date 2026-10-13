import { useCallback, useEffect, useRef, useState } from 'react';
import type { DependencyList, Dispatch, SetStateAction } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
  setData: Dispatch<SetStateAction<T | null>>;
}

/** Runs an async loader on mount (and when `deps` change) and tracks loading and error state. */
export function useAsync<T>(loader: () => Promise<T>, deps: DependencyList = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const runId = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    loader()
      .then((result) => {
        if (id === runId.current) setData(result);
      })
      .catch((e: unknown) => {
        if (id === runId.current) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (id === runId.current) setLoading(false);
      });
  }, deps);

  useEffect(() => {
    run();
    return () => {
      runId.current++;
    };
  }, [run]);

  return { data, loading, error, reload: run, setData };
}
