import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Copy, Download, Lock, Unlock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Algorithm, 
  caesarEncrypt, 
  caesarDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  reverseEncrypt,
  reverseDecrypt,
  xorEncrypt,
  xorDecrypt,
  base64Encrypt,
  base64Decrypt,
  aesEncrypt,
  aesDecrypt,
  rsaEncrypt,
  rsaDecrypt
} from '@/lib/encryption';
import { saveToHistory } from '@/lib/history';

const algorithms: { value: Algorithm; label: string; needsKey: boolean; needsShift: boolean }[] = [
  { value: 'caesar', label: 'Caesar Cipher', needsKey: false, needsShift: true },
  { value: 'vigenere', label: 'Vigenère Cipher', needsKey: true, needsShift: false },
  { value: 'reverse', label: 'Reverse Cipher', needsKey: false, needsShift: false },
  { value: 'xor', label: 'XOR Cipher', needsKey: true, needsShift: false },
  { value: 'base64', label: 'Base64', needsKey: false, needsShift: false },
  { value: 'aes', label: 'AES Encryption', needsKey: true, needsShift: false },
  { value: 'rsa', label: 'RSA (Demo)', needsKey: false, needsShift: false },
];

export function EncryptionPanel() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('caesar');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const selectedAlgo = algorithms.find(a => a.value === algorithm)!;

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    processText();
  }, [input, key, shift, algorithm, mode]);

  const processText = () => {
    let result;

    if (mode === 'encrypt') {
      switch (algorithm) {
        case 'caesar':
          result = caesarEncrypt(input, shift);
          break;
        case 'vigenere':
          result = vigenereEncrypt(input, key);
          break;
        case 'reverse':
          result = reverseEncrypt(input);
          break;
        case 'xor':
          result = xorEncrypt(input, key);
          break;
        case 'base64':
          result = base64Encrypt(input);
          break;
        case 'aes':
          result = aesEncrypt(input, key);
          break;
        case 'rsa':
          result = rsaEncrypt(input);
          break;
      }
    } else {
      switch (algorithm) {
        case 'caesar':
          result = caesarDecrypt(input, shift);
          break;
        case 'vigenere':
          result = vigenereDecrypt(input, key);
          break;
        case 'reverse':
          result = reverseDecrypt(input);
          break;
        case 'xor':
          result = xorDecrypt(input, key);
          break;
        case 'base64':
          result = base64Decrypt(input);
          break;
        case 'aes':
          result = aesDecrypt(input, key);
          break;
        case 'rsa':
          result = rsaDecrypt(input);
          break;
      }
    }

    if (result?.success) {
      setOutput(result.output);
      if (result.output && input) {
        saveToHistory({ algorithm, input, output: result.output, mode });
      }
    } else {
      setOutput('');
      if (result?.error) {
        toast.error(result.error);
      }
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CipherCore_${algorithm}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setKey('');
    setShift(3);
    toast.info('Cleared all fields');
  };

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-6 hover-glow animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold glow-text">Encryption Lab</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearAll}
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Algorithm</Label>
          <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
            <SelectTrigger className="glass border-primary/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-strong border-primary/30">
              {algorithms.map(algo => (
                <SelectItem key={algo.value} value={algo.value}>
                  {algo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Mode</Label>
          <div className="flex gap-2">
            <Button
              variant={mode === 'encrypt' ? 'default' : 'outline'}
              onClick={() => setMode('encrypt')}
              className="flex-1"
            >
              <Lock className="w-4 h-4 mr-2" />
              Encrypt
            </Button>
            <Button
              variant={mode === 'decrypt' ? 'default' : 'outline'}
              onClick={() => setMode('decrypt')}
              className="flex-1"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Decrypt
            </Button>
          </div>
        </div>
      </div>

      {selectedAlgo.needsKey && (
        <div className="space-y-2">
          <Label>Secret Key</Label>
          <Input
            type="text"
            placeholder="Enter your secret key..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="glass border-primary/30 focus:border-primary"
          />
        </div>
      )}

      {selectedAlgo.needsShift && (
        <div className="space-y-2">
          <Label>Shift Value: {shift}</Label>
          <input
            type="range"
            min="1"
            max="25"
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Input Text</Label>
        <Textarea
          placeholder="Enter text to encrypt/decrypt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="glass border-primary/30 focus:border-primary min-h-[120px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Output</Label>
        <div className="relative">
          <Textarea
            value={output}
            readOnly
            placeholder="Encrypted/Decrypted text will appear here..."
            className="glass-strong border-accent/30 min-h-[120px] resize-none pr-20"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              disabled={!output}
              className="hover:bg-primary/10"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={downloadOutput}
              disabled={!output}
              className="hover:bg-primary/10"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
