import { useCallback, useState } from 'react';

export function useMutationLock(initialLocked = false) {
  const [isLocked, setIsLocked] = useState(initialLocked);

  const runWithLock = useCallback(
    async (task) => {
      if (isLocked) {
        return undefined;
      }

      setIsLocked(true);
      try {
        return await task();
      } finally {
        setIsLocked(false);
      }
    },
    [isLocked]
  );

  return {
    isLocked,
    setIsLocked,
    runWithLock,
  };
}
