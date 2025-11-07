import { useState, useEffect } from 'react';
import { getHistory, HistoryEntry } from '@/lib/history';

export function useRealtimeHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory());

  useEffect(() => {
    const handleHistoryUpdate = () => {
      setHistory(getHistory());
    };

    window.addEventListener('historyUpdate', handleHistoryUpdate);
    window.addEventListener('storage', handleHistoryUpdate);

    return () => {
      window.removeEventListener('historyUpdate', handleHistoryUpdate);
      window.removeEventListener('storage', handleHistoryUpdate);
    };
  }, []);

  return history;
}
