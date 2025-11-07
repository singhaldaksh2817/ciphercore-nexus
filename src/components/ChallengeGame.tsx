import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trophy, Zap, Target, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { caesarEncrypt, vigenereEncrypt, reverseEncrypt, base64Encrypt } from '@/lib/encryption';

interface Challenge {
  id: number;
  plaintext: string;
  algorithm: string;
  hint: string;
  encrypted: string;
  points: number;
}

const challenges: Omit<Challenge, 'encrypted'>[] = [
  {
    id: 1,
    plaintext: 'CRYPTO',
    algorithm: 'caesar',
    hint: 'Caesar Cipher with shift 3',
    points: 10,
  },
  {
    id: 2,
    plaintext: 'SECRET',
    algorithm: 'reverse',
    hint: 'Just backwards!',
    points: 5,
  },
  {
    id: 3,
    plaintext: 'HELLO',
    algorithm: 'vigenere',
    hint: 'Vigenère with key "KEY"',
    points: 15,
  },
  {
    id: 4,
    plaintext: 'CHALLENGE',
    algorithm: 'caesar',
    hint: 'Caesar Cipher with shift 5',
    points: 10,
  },
  {
    id: 5,
    plaintext: 'VICTORY',
    algorithm: 'base64',
    hint: 'Base64 encoding',
    points: 20,
  },
];

export function ChallengeGame() {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);
  const [encryptedChallenges, setEncryptedChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    // Generate encrypted versions when component mounts
    const encrypted = challenges.map(challenge => {
      let result = '';
      switch (challenge.algorithm) {
        case 'caesar':
          const shift = challenge.id === 1 ? 3 : 5;
          result = caesarEncrypt(challenge.plaintext, shift).output;
          break;
        case 'reverse':
          result = reverseEncrypt(challenge.plaintext).output;
          break;
        case 'vigenere':
          result = vigenereEncrypt(challenge.plaintext, 'KEY').output;
          break;
        case 'base64':
          result = base64Encrypt(challenge.plaintext).output;
          break;
      }
      return { ...challenge, encrypted: result };
    });
    setEncryptedChallenges(encrypted);
  }, []);

  useEffect(() => {
    let timer: number;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setCurrentChallengeIndex(0);
    setUserAnswer('');
    setAttempts(0);
    setSolved([]);
    toast.info('Game Started! Decrypt the messages!');
  };

  const endGame = () => {
    setIsPlaying(false);
    toast.success(`Game Over! Final Score: ${score} points`);
  };

  const checkAnswer = () => {
    if (!encryptedChallenges.length || !isPlaying) return;

    const currentChallenge = encryptedChallenges[currentChallengeIndex];
    setAttempts(attempts + 1);

    if (userAnswer.toUpperCase() === currentChallenge.plaintext) {
      const earnedPoints = currentChallenge.points;
      setScore(score + earnedPoints);
      setSolved([...solved, currentChallenge.id]);
      toast.success(`Correct! +${earnedPoints} points`, {
        icon: <CheckCircle2 className="w-4 h-4" />,
      });

      // Move to next challenge
      if (currentChallengeIndex < encryptedChallenges.length - 1) {
        setCurrentChallengeIndex(currentChallengeIndex + 1);
        setUserAnswer('');
        setAttempts(0);
        setTimeLeft(timeLeft + 10); // Bonus time
      } else {
        // Won the game
        setIsPlaying(false);
        toast.success(`🎉 You solved all challenges! Final Score: ${score + earnedPoints}`);
      }
    } else {
      toast.error('Incorrect! Try again', {
        icon: <XCircle className="w-4 h-4" />,
      });
      
      if (attempts >= 2) {
        toast.info('Hint: ' + currentChallenge.hint);
      }
    }
  };

  const skipChallenge = () => {
    if (currentChallengeIndex < encryptedChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setUserAnswer('');
      setAttempts(0);
      toast.info('Challenge skipped!');
    }
  };

  if (!encryptedChallenges.length) {
    return <div>Loading challenges...</div>;
  }

  const currentChallenge = encryptedChallenges[currentChallengeIndex];

  return (
    <div className="glass-strong rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent animate-float" />
          <h2 className="text-xl font-bold text-accent">Decryption Challenge</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="font-mono font-bold text-sm">{score} pts</span>
          </div>
          {isPlaying && (
            <div className={`flex items-center gap-2 glass px-3 py-1 rounded-full ${
              timeLeft <= 10 ? 'border border-red-500 animate-pulse' : ''
            }`}>
              <Target className="w-4 h-4 text-primary" />
              <span className="font-mono font-bold text-sm">{timeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center py-12 space-y-4">
          <div className="glass rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-2xl font-bold glow-text">Ready to Test Your Skills?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Decrypt encrypted messages as fast as you can! Each correct answer earns points and bonus time.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
            <div className="glass rounded-lg p-3">
              <div className="font-bold text-accent">⏱️ 60 Seconds</div>
              <div className="text-xs text-muted-foreground">Time to solve</div>
            </div>
            <div className="glass rounded-lg p-3">
              <div className="font-bold text-accent">🎯 5 Challenges</div>
              <div className="text-xs text-muted-foreground">To complete</div>
            </div>
          </div>
          {score > 0 && (
            <div className="glass rounded-lg p-4 max-w-sm mx-auto">
              <div className="text-sm text-muted-foreground">Last Score</div>
              <div className="text-2xl font-bold text-accent">{score} points</div>
            </div>
          )}
          <Button
            onClick={startGame}
            size="lg"
            className="bg-accent hover:bg-accent/80 text-black font-bold px-8"
          >
            Start Challenge
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Challenge {currentChallengeIndex + 1} of {encryptedChallenges.length}
            </span>
            <span className="text-primary font-mono">
              {solved.length} solved
            </span>
          </div>

          <div className="glass rounded-lg p-6 space-y-4 border border-accent/30">
            <div>
              <h3 className="text-sm font-semibold text-accent mb-2">Encrypted Message:</h3>
              <div className="glass-strong rounded p-4 font-mono text-lg tracking-wider text-center">
                {currentChallenge.encrypted}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Your Answer:
              </h3>
              <Input
                placeholder="Type the decrypted message..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                className="glass border-primary/30 focus:border-accent font-mono text-lg"
                autoFocus
              />
            </div>

            {attempts >= 2 && (
              <div className="glass-strong rounded p-3 border border-yellow-500/30">
                <p className="text-sm text-yellow-400">
                  💡 Hint: {currentChallenge.hint}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="flex-1 bg-primary hover:bg-primary/80"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit
              </Button>
              <Button
                onClick={skipChallenge}
                variant="outline"
                className="border-muted-foreground/30"
              >
                Skip
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {encryptedChallenges.map((challenge, idx) => (
              <div
                key={challenge.id}
                className={`flex-1 h-2 rounded-full transition-all ${
                  solved.includes(challenge.id)
                    ? 'bg-accent'
                    : idx === currentChallengeIndex
                    ? 'bg-primary animate-pulse'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
