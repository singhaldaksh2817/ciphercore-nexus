import { Algorithm } from './encryption';

export interface HistoryEntry {
  id: string;
  algorithm: Algorithm;
  input: string;
  output: string;
  timestamp: number;
  mode: 'encrypt' | 'decrypt';
}

const HISTORY_KEY = 'ciphercore_history';
const MAX_HISTORY = 100;

export function saveToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  history.unshift(newEntry);
  
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  window.dispatchEvent(new Event('historyUpdate'));
}

export function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event('historyUpdate'));
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory();
  const filtered = history.filter(entry => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('historyUpdate'));
}

export function searchHistory(query: string): HistoryEntry[] {
  const history = getHistory();
  const lowerQuery = query.toLowerCase();
  
  return history.filter(entry => 
    entry.algorithm.includes(lowerQuery) ||
    entry.input.toLowerCase().includes(lowerQuery) ||
    entry.output.toLowerCase().includes(lowerQuery)
  );
}

export function filterHistoryByAlgorithm(algorithm: Algorithm | 'all'): HistoryEntry[] {
  if (algorithm === 'all') return getHistory();
  return getHistory().filter(entry => entry.algorithm === algorithm);
}

export function exportHistory(format: 'json' | 'txt'): string {
  const history = getHistory();
  
  if (format === 'json') {
    return JSON.stringify(history, null, 2);
  }
  
  // Text format
  return history.map(entry => {
    const date = new Date(entry.timestamp).toLocaleString();
    return `[${date}] ${entry.algorithm.toUpperCase()} - ${entry.mode.toUpperCase()}\nInput: ${entry.input}\nOutput: ${entry.output}\n${'='.repeat(50)}\n`;
  }).join('\n');
}
