import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { History, Search, Download, Trash2, Copy, X } from 'lucide-react';
import { clearHistory, searchHistory, filterHistoryByAlgorithm, exportHistory, deleteHistoryEntry } from '@/lib/history';
import { Algorithm } from '@/lib/encryption';
import { toast } from 'sonner';
import { useRealtimeHistory } from '@/hooks/useRealtimeHistory';

export function HistoryPanel() {
  const allHistory = useRealtimeHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAlgo, setFilterAlgo] = useState<Algorithm | 'all'>('all');
  const [isOpen, setIsOpen] = useState(false);

  const getFilteredHistory = () => {
    let filtered = allHistory;
    
    if (filterAlgo !== 'all') {
      filtered = filtered.filter(entry => entry.algorithm === filterAlgo);
    }
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.algorithm.includes(lowerQuery) ||
        entry.input.toLowerCase().includes(lowerQuery) ||
        entry.output.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  };

  const handleClearHistory = () => {
    clearHistory();
    toast.success('History cleared!');
  };

  const handleDeleteEntry = (id: string) => {
    deleteHistoryEntry(id);
    toast.success('Entry deleted!');
  };

  const handleExport = (format: 'json' | 'txt') => {
    const content = exportHistory(format);
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ciphercore-history-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}!`);
  };

  const copyEntry = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const filteredHistory = getFilteredHistory();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg hover-glow bg-primary hover:bg-primary/90"
        >
          <History className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-xl glass-strong border-primary/30">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <span>History</span>
              <span className="text-sm text-muted-foreground">({filteredHistory.length})</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-primary/30"
            />
          </div>

          <Select value={filterAlgo} onValueChange={(v) => setFilterAlgo(v as Algorithm | 'all')}>
            <SelectTrigger className="glass border-primary/30">
              <SelectValue placeholder="Filter by algorithm" />
            </SelectTrigger>
            <SelectContent className="glass-strong border-primary/30">
              <SelectItem value="all">All Algorithms</SelectItem>
              <SelectItem value="caesar">Caesar</SelectItem>
              <SelectItem value="vigenere">Vigenère</SelectItem>
              <SelectItem value="reverse">Reverse</SelectItem>
              <SelectItem value="xor">XOR</SelectItem>
              <SelectItem value="base64">Base64</SelectItem>
              <SelectItem value="aes">AES</SelectItem>
              <SelectItem value="rsa">RSA</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              className="flex-1 border-primary/30"
            >
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('txt')}
              className="flex-1 border-primary/30"
            >
              <Download className="w-4 h-4 mr-2" />
              TXT
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)] mt-4 pr-4">
          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No history yet</p>
              </div>
            ) : (
              filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="glass rounded-lg p-4 space-y-2 hover-glow transition-all animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary uppercase">
                        {entry.algorithm}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {entry.mode}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-[60px]">Input:</span>
                      <span className="flex-1 break-all">{entry.input.substring(0, 50)}{entry.input.length > 50 ? '...' : ''}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-[60px]">Output:</span>
                      <span className="flex-1 break-all">{entry.output.substring(0, 50)}{entry.output.length > 50 ? '...' : ''}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyEntry(entry.output)}
                    className="w-full hover:bg-primary/10"
                  >
                    <Copy className="w-3 h-3 mr-2" />
                    Copy Output
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
