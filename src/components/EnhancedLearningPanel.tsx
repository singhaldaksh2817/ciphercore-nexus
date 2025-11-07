import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface CodeExample {
  language: string;
  code: string;
}

interface AlgoInfo {
  name: string;
  description: string;
  details: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  example: string;
  codeExamples: CodeExample[];
}

const algorithms: AlgoInfo[] = [
  {
    name: 'Caesar Cipher',
    description: 'A substitution cipher where each letter is shifted by a fixed number of positions.',
    details: 'Named after Julius Caesar, who used it for military communications. The shift value determines how many positions each letter moves. For example, with a shift of 3, A becomes D, B becomes E, and so on.',
    difficulty: 'Easy',
    example: 'Plain: HELLO → Shift 3 → Cipher: KHOOR',
    codeExamples: [
      {
        language: 'Python',
        code: `def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            start = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - start + shift) % 26 + start)
        else:
            result += char
    return result

# Example usage
encrypted = caesar_encrypt("HELLO", 3)
print(encrypted)  # Output: KHOOR`
      },
      {
        language: 'JavaScript',
        code: `function caesarEncrypt(text, shift) {
    return text.split('').map(char => {
        if (/[a-z]/i.test(char)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(
                ((code - base + shift) % 26) + base
            );
        }
        return char;
    }).join('');
}

// Example usage
const encrypted = caesarEncrypt("HELLO", 3);
console.log(encrypted); // Output: KHOOR`
      },
      {
        language: 'Java',
        code: `public class CaesarCipher {
    public static String encrypt(String text, int shift) {
        StringBuilder result = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (Character.isLetter(c)) {
                char base = Character.isUpperCase(c) ? 'A' : 'a';
                c = (char) ((c - base + shift) % 26 + base);
            }
            result.append(c);
        }
        return result.toString();
    }
    
    public static void main(String[] args) {
        System.out.println(encrypt("HELLO", 3)); // Output: KHOOR
    }
}`
      },
      {
        language: 'C++',
        code: `#include <iostream>
#include <string>
using namespace std;

string caesarEncrypt(string text, int shift) {
    string result = "";
    for (char c : text) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = (c - base + shift) % 26 + base;
        }
        result += c;
    }
    return result;
}

int main() {
    cout << caesarEncrypt("HELLO", 3) << endl; // Output: KHOOR
    return 0;
}`
      }
    ]
  },
  {
    name: 'Vigenère Cipher',
    description: 'A polyalphabetic cipher using a keyword to determine the shift for each letter.',
    details: 'More secure than Caesar cipher as it uses multiple shift values based on a keyword. Each letter of the keyword determines the shift for the corresponding position in the plaintext.',
    difficulty: 'Medium',
    example: 'Plain: HELLO, Key: KEY → Cipher: RIJVS',
    codeExamples: [
      {
        language: 'Python',
        code: `def vigenere_encrypt(text, key):
    result = ""
    key = key.upper()
    key_index = 0
    
    for char in text:
        if char.isalpha():
            shift = ord(key[key_index % len(key)]) - ord('A')
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
            key_index += 1
        else:
            result += char
    return result

# Example
encrypted = vigenere_encrypt("HELLO", "KEY")
print(encrypted)  # Output: RIJVS`
      },
      {
        language: 'JavaScript',
        code: `function vigenereEncrypt(text, key) {
    const cleanKey = key.toUpperCase();
    let keyIndex = 0;
    let result = '';
    
    for (let char of text) {
        if (/[a-z]/i.test(char)) {
            const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
            const base = char >= 'A' && char <= 'Z' ? 65 : 97;
            result += String.fromCharCode(
                ((char.charCodeAt(0) - base + shift) % 26) + base
            );
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}`
      }
    ]
  },
  {
    name: 'RSA Encryption',
    description: 'Asymmetric encryption using public and private key pairs.',
    details: 'RSA uses two keys: a public key for encryption and a private key for decryption. It relies on the mathematical difficulty of factoring large prime numbers. Widely used for secure communications.',
    difficulty: 'Hard',
    example: 'Uses large prime numbers p and q, where n = p × q',
    codeExamples: [
      {
        language: 'Python',
        code: `# Simplified RSA (educational purposes only)
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def mod_inverse(e, phi):
    for d in range(1, phi):
        if (d * e) % phi == 1:
            return d
    return None

# Choose two prime numbers
p, q = 61, 53
n = p * q  # 3233
phi = (p - 1) * (q - 1)  # 3120

# Public exponent
e = 17

# Private exponent
d = mod_inverse(e, phi)

# Encryption: c = m^e mod n
def encrypt(message, e, n):
    return pow(message, e, n)

# Decryption: m = c^d mod n
def decrypt(cipher, d, n):
    return pow(cipher, d, n)

# Example
msg = 65  # Character 'A'
encrypted = encrypt(msg, e, n)
decrypted = decrypt(encrypted, d, n)
print(f"Encrypted: {encrypted}, Decrypted: {decrypted}")`
      },
      {
        language: 'Java',
        code: `import java.math.BigInteger;

public class RSA {
    private BigInteger n, d, e;
    
    public RSA(int bitlen) {
        BigInteger p = BigInteger.probablePrime(bitlen / 2, new Random());
        BigInteger q = BigInteger.probablePrime(bitlen / 2, new Random());
        n = p.multiply(q);
        BigInteger phi = p.subtract(BigInteger.ONE)
                          .multiply(q.subtract(BigInteger.ONE));
        e = BigInteger.valueOf(65537);
        d = e.modInverse(phi);
    }
    
    public BigInteger encrypt(BigInteger message) {
        return message.modPow(e, n);
    }
    
    public BigInteger decrypt(BigInteger cipher) {
        return cipher.modPow(d, n);
    }
}`
      }
    ]
  },
  {
    name: 'XOR Cipher',
    description: 'Uses bitwise XOR operation with a key to encrypt data.',
    details: 'XOR (exclusive OR) is a binary operation. Each bit of the plaintext is XORed with the corresponding bit of the key. Very fast and used in many modern encryption systems as a building block.',
    difficulty: 'Medium',
    example: 'Plain: 01001000, Key: 01010101 → Cipher: 00011101',
    codeExamples: [
      {
        language: 'Python',
        code: `def xor_encrypt(text, key):
    return ''.join(chr(ord(c) ^ ord(key[i % len(key)])) 
                   for i, c in enumerate(text))

# Example
encrypted = xor_encrypt("HELLO", "KEY")
decrypted = xor_encrypt(encrypted, "KEY")  # XOR is reversible
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")`
      },
      {
        language: 'C++',
        code: `#include <string>
using namespace std;

string xorEncrypt(string text, string key) {
    string result = text;
    for (size_t i = 0; i < text.length(); i++) {
        result[i] = text[i] ^ key[i % key.length()];
    }
    return result;
}`
      }
    ]
  },
  {
    name: 'Base64',
    description: 'Encodes binary data into ASCII characters for safe transmission.',
    details: 'Not encryption but encoding. Converts binary data to text using 64 different ASCII characters. Commonly used for sending images or files over text-based protocols.',
    difficulty: 'Easy',
    example: 'Plain: Hello → Base64: SGVsbG8=',
    codeExamples: [
      {
        language: 'Python',
        code: `import base64

# Encoding
text = "Hello"
encoded = base64.b64encode(text.encode()).decode()
print(f"Encoded: {encoded}")  # SGVsbG8=

# Decoding
decoded = base64.b64decode(encoded).decode()
print(f"Decoded: {decoded}")  # Hello`
      },
      {
        language: 'JavaScript',
        code: `// Encoding
const text = "Hello";
const encoded = btoa(text);
console.log("Encoded:", encoded); // SGVsbG8=

// Decoding
const decoded = atob(encoded);
console.log("Decoded:", decoded); // Hello`
      }
    ]
  },
  {
    name: 'AES Encryption',
    description: 'Advanced Encryption Standard - the most widely used modern encryption.',
    details: 'A symmetric encryption algorithm that uses complex mathematical operations. Extremely secure and used by governments and corporations worldwide. Supports 128, 192, and 256-bit keys.',
    difficulty: 'Hard',
    example: 'Uses complex block cipher operations with multiple rounds of substitution and permutation.',
    codeExamples: [
      {
        language: 'Python',
        code: `from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

key = get_random_bytes(16)  # 128-bit key
cipher = AES.new(key, AES.MODE_CBC)

# Encryption
message = b"Secret Message"
ciphertext = cipher.encrypt(pad(message, AES.block_size))

# Decryption
decipher = AES.new(key, AES.MODE_CBC, cipher.iv)
plaintext = unpad(decipher.decrypt(ciphertext), AES.block_size)

print(f"Decrypted: {plaintext.decode()}")`
      },
      {
        language: 'JavaScript',
        code: `// Using CryptoJS library
const CryptoJS = require('crypto-js');

const message = "Secret Message";
const key = "my-secret-key-123";

// Encryption
const encrypted = CryptoJS.AES.encrypt(message, key).toString();
console.log("Encrypted:", encrypted);

// Decryption
const decrypted = CryptoJS.AES.decrypt(encrypted, key)
                          .toString(CryptoJS.enc.Utf8);
console.log("Decrypted:", decrypted);`
      }
    ]
  }
];

export function EnhancedLearningPanel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold">Learn Cryptography</h2>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {algorithms.map((algo, index) => (
            <div
              key={index}
              className="glass rounded-lg overflow-hidden hover-glow transition-all"
            >
              <button
                onClick={() => toggleExpand(index)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-primary/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-primary">{algo.name}</h3>
                    <span className={`text-xs font-mono ${getDifficultyColor(algo.difficulty)}`}>
                      {algo.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{algo.description}</p>
                </div>
                {expandedIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {expandedIndex === index && (
                <div className="px-4 pb-4 space-y-3 border-t border-primary/20 pt-4 animate-fade-in">
                  <div>
                    <h4 className="text-sm font-semibold text-accent mb-2">How it works:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {algo.details}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-accent mb-2">Example:</h4>
                    <div className="glass-strong rounded p-3 font-mono text-xs">
                      {algo.example}
                    </div>
                  </div>

                  {algo.codeExamples.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                        <Code2 className="w-4 h-4" />
                        Code Examples:
                      </h4>
                      <Tabs defaultValue={algo.codeExamples[0].language} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 glass-strong">
                          {algo.codeExamples.map((example) => (
                            <TabsTrigger 
                              key={example.language} 
                              value={example.language}
                              className="text-xs"
                            >
                              {example.language}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {algo.codeExamples.map((example) => (
                          <TabsContent key={example.language} value={example.language}>
                            <ScrollArea className="h-[300px] w-full rounded-md">
                              <pre className="glass-strong p-4 rounded text-xs font-mono overflow-x-auto">
                                <code>{example.code}</code>
                              </pre>
                            </ScrollArea>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/30 hover:bg-primary/10"
                    onClick={() => window.open(`https://en.wikipedia.org/wiki/${algo.name.replace(' ', '_')}`, '_blank')}
                  >
                    Learn More
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="glass rounded-lg p-4 border border-accent/30">
        <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
          💡 Did You Know?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The word "cryptography" comes from Greek words meaning "hidden writing." 
          Ancient civilizations used encryption to protect military secrets, and today 
          it secures everything from your messages to online banking!
        </p>
      </div>
    </div>
  );
}
