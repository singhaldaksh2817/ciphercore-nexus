import { Shield, Github } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="glass-strong border-b border-primary/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold glow-text">CipherCore</h1>
              <p className="text-xs text-muted-foreground">Encrypt. Learn. Protect.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover-glow p-2 rounded-lg glass transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
