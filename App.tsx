import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Generator from './components/Generator';
import Flashcard from './components/Flashcard';
import { generateFlashcards } from './services/geminiService';
import { FlashcardData, GenerationConfig } from './types';
import { ChevronLeft, ChevronRight, Layers, Home } from 'lucide-react';

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'generator' | 'review'>('generator');

  const handleGenerate = async (config: GenerationConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCards = await generateFlashcards(config.topic, config.difficulty);
      setCards(newCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setView('review');
    } catch (err: any) {
      setError(err.message || "Failed to generate cards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleReset = () => {
    setCards([]);
    setView('generator');
    setError(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'review') return;
      
      switch (e.key) {
        case ' ':
        case 'Enter':
          setIsFlipped(prev => !prev);
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentIndex, cards.length]);

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-50">
      <Header onMainClick={view === 'review' ? handleReset : undefined} />

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        
        {error && (
          <div className="w-full max-w-lg mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-center">
            {error}
          </div>
        )}

        {view === 'generator' ? (
          <Generator onGenerate={handleGenerate} isLoading={isLoading} />
        ) : (
          <div className="w-full max-w-4xl flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-300">
            
            {/* Progress Bar & Menu */}
            <div className="w-full max-w-md flex items-center justify-between text-slate-500 text-sm font-medium mb-4">
               <span className="flex items-center gap-2">
                 <Layers className="w-4 h-4" />
                 Card {currentIndex + 1} of {cards.length}
               </span>
               <button 
                 onClick={handleReset}
                 className="flex items-center gap-1.5 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all"
               >
                 <Home className="w-4 h-4" />
                 Main Menu
               </button>
            </div>
            
            <div className="w-full h-1 max-w-md bg-slate-200 rounded-full overflow-hidden mb-6">
               <div 
                 className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                 style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
               />
            </div>

            {/* Card Area */}
            {cards.length > 0 && (
              <Flashcard 
                data={cards[currentIndex]} 
                isFlipped={isFlipped} 
                onFlip={() => setIsFlipped(!isFlipped)} 
              />
            )}

            {/* Controls */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Previous Card (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-lg shadow-slate-300 hover:shadow-emerald-200 hover:bg-emerald-600 transition-all min-w-[140px]"
              >
                {isFlipped ? 'Show Term' : 'Reveal'}
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="p-4 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Next Card (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-slate-400 text-sm mt-8">
              Tip: Use Spacebar to flip, Arrow keys to navigate
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;