import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Stars, Zap } from 'lucide-react';

const LoadingSpinner = () => {
  const [loadingPhrase, setLoadingPhrase] = useState(0);
  const [dots, setDots] = useState('');
  const [isSparkle, setIsSparkle] = useState(false);
  const [progress, setProgress] = useState(0);

  const phrases = [
    "Brewing some coffee...",
    "Counting pixels one by one...",
    "Teaching hamsters to code in React...",
    "Reticulating splines in 4D...",
    "Generating witty loading messages...",
    "Convincing AI not to take over...",
    "Downloading more RAM...",
    "Warming up the flux capacitor...",
    "Untangling virtual wires...",
    "Solving quantum equations..."
  ];

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setLoadingPhrase((prev) => (prev + 1) % phrases.length);
      setIsSparkle(Math.random() > 0.5);
    }, 2000);

    return () => clearInterval(phraseInterval);
  }, []);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev === '...' ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 150);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-64 p-8 space-y-6 select-none">
      {/* Interactive spinner */}
      <div className="relative group transform transition-transform hover:scale-110">
        <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
        </div>
        {isSparkle && (
          <>
            <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-red-600 animate-bounce" />
            <Stars className="absolute -bottom-4 -left-4 w-6 h-6 text-red-600 animate-bounce" />
            <Zap className="absolute -top-4 -left-4 w-6 h-6 text-red-600 animate-bounce" />
          </>
        )}
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700 animate-pulse group-hover:text-red-600 transition-colors">
          {phrases[loadingPhrase]}{dots}
        </p>
        <p className="text-sm text-gray-500">
          {progress}% complete
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-red-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-600/20 rounded-full animate-[float_3s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `scale(${Math.random() + 0.5})`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
