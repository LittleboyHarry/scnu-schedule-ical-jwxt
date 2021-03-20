import { useEffect } from 'react';

export function useBodyScrollLock(open = true) {
  useEffect(() => {
    document.body.style.overflowY = open ? 'hidden' : '';
  }, [open]);
}
