import { UsernameForm } from '@/components/UsernameForm';
import { HeroCards } from '@/components/HeroCards';
import { Suspense } from 'react';
import { CardsScoutedCount, ActivityGraph } from '@/components/landing/LandingStats';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden min-h-[calc(100vh-80px)]">
      
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gfg-green rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d9a53a] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-float animate-delay-300 pointer-events-none"></div>

      {/* GitHub Star Badge */}
      <a 
        href="https://github.com/anuj-pisal/GeekFut" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-6 right-6 md:top-8 md:right-12 z-50 flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-white/10 border border-white/10 rounded-full text-sm font-body text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-md"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <span className="font-medium">Star on GitHub</span>
        <span className="text-[#eaddb9]">★</span>
      </a>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10 my-auto transform scale-90 lg:scale-[0.70] origin-center">
        
        {/* Left Side: Hero Text and Form */}
        <div className="min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in-up z-20">
          
          {/* Logo and Title Box */}
          <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 mb-10">
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-white/15 blur-3xl rounded-full opacity-40"></div>
              <img
                src="/newLogo.png"
                alt="GeekFut Logo"
                className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)] animate-float"
              />
            </div>
            <h1 className="relative z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter leading-[0.9] break-words">
              <span className="text-white">Geek</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-gfg-green via-gfg-green to-emerald-400">Fut</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-2xl font-body text-gray-300 mb-12 max-w-xl leading-relaxed font-light opacity-90">
            Your GeeksforGeeks stats, turned into a World-Cup-style player card rated <strong className="text-white font-semibold">out of 99</strong>.
          </p>

          <div className="w-full max-w-xl relative">
            <UsernameForm />
            
            <div className="mt-5 flex flex-col gap-2 pl-2 lg:pl-4">
              <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse shadow-[0_0_8px_#00FF66]"></div> 
                  <Suspense fallback={<span className="w-3 h-3 rounded-full border-2 border-[#00FF66] border-t-transparent animate-spin inline-block"></span>}>
                    <CardsScoutedCount />
                  </Suspense> cards rated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Fanned out Player Cards */}
        <div className="hidden lg:flex min-w-0 flex-col items-center justify-center min-h-[500px] animate-fade-in-up animate-delay-300 relative w-full z-10 ml-[100px]">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-gfg-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          }>
            <HeroCards />
          </Suspense>
        </div>
      </div>

      <footer className="absolute bottom-6 text-center text-sm font-body text-gray-500 w-full animate-fade-in-up animate-delay-300 z-10 flex flex-col items-center">
        <div className="mb-4">
          <Suspense fallback={null}>
            <ActivityGraph />
          </Suspense>
        </div>
        <p className="flex items-center justify-center space-x-2">
          <span>Built by</span>
          <a href="https://github.com/anuj-pisal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1 font-bold group">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current group-hover:scale-110 transition-transform"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>Anuj Pisal</span>
          </a>
        </p>
      </footer>
    </main>
  );
}