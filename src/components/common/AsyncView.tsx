import type { ReactNode } from 'react';
import type { AsyncState } from '@/hooks/useAsync';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';

interface AsyncViewProps<T> {
  state: AsyncState<T>;
  skeleton: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}

/** Shows a skeleton while loading, an error state with retry on failure, an empty state, or the data. */
export function AsyncView<T>({ state, skeleton, isEmpty, empty, children }: AsyncViewProps<T>) {
  if (state.loading && state.data === null) return <>{skeleton}</>;
  if (state.error) return <ErrorState onRetry={state.reload} />;
  if (state.data === null) return <>{skeleton}</>;
  if (isEmpty && isEmpty(state.data)) {
    return <>{empty ?? <EmptyState title="Nothing here yet" description="New items will show up here." />}</>;
  }
  return <>{children(state.data)}</>;
}
