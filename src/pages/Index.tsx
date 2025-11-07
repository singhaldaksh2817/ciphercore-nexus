import { Navbar } from '@/components/Navbar';
import { EncryptionPanel } from '@/components/EncryptionPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { EnhancedLearningPanel } from '@/components/EnhancedLearningPanel';
import { CipherBot } from '@/components/CipherBot';
import { ParticleBackground } from '@/components/ParticleBackground';
import { ChallengeGame } from '@/components/ChallengeGame';

const Index = () => {
  return (
    <div className="min-h-screen cyber-bg relative overflow-x-hidden">
      <ParticleBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 glow-text">
              CipherCore Web
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced encryption platform for learning and protecting your data
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="glass-strong px-4 py-2 rounded-full text-sm">
                <span className="text-primary">🔐</span> 6 Algorithms
              </div>
              <div className="glass-strong px-4 py-2 rounded-full text-sm">
                <span className="text-secondary">🧠</span> AI Assistant
              </div>
              <div className="glass-strong px-4 py-2 rounded-full text-sm">
                <span className="text-accent">📚</span> Learn & Explore
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Encryption Panel - Full Width */}
            <div>
              <EncryptionPanel />
            </div>
          </div>

          {/* Floating History Panel */}
          <HistoryPanel />

          {/* Challenge Game - Full Width */}
          <div className="mb-6">
            <ChallengeGame />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Panel */}
            <div>
              <EnhancedLearningPanel />
            </div>

            {/* CipherBot */}
            <div>
              <CipherBot />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center pb-6">
            <div className="glass-strong rounded-full px-6 py-3 inline-block">
              <p className="text-sm text-muted-foreground">
                © 2025 CipherCore by Daksh and Vansh
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
