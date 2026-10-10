import { useCallback, useEffect, useRef, useState } from 'react';

/** Tiny data hook: const { data, loading, error, reload } = useAsync(() => api.plans(), []) */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const alive = useRef(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async (silent = false) => {
    if (!silent) setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await fnRef.current();
      if (alive.current) setState({ data, loading: false, error: '' });
      return data;
    } catch (e) {
      if (alive.current) setState((s) => ({ data: silent ? s.data : null, loading: false, error: e.message }));
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    run();
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload: () => run(true), refetch: () => run(false), setData: (d) => setState((s) => ({ ...s, data: typeof d === 'function' ? d(s.data) : d })) };
}
