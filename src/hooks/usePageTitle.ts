import { useEffect } from 'react';
import { CLUB } from '@/data/site';

/** Sets the browser tab title for the current page. */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${CLUB.name}` : CLUB.name;
  }, [title]);
}
