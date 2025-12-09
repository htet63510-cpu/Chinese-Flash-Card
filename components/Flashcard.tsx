import React from 'react';
import { FlashcardData } from '../types';
import { Volume2 } from 'lucide-react';

interface FlashcardProps {
  data: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ data, isFlipped, onFlip }) => {
  // Guard against undefined data to prevent crashes
  if (!data) {
    return (
      <div className="w-full max-w-md h-96 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400">Card data unavailable</p>
      </div>
    );
  }
  
  const handleSpeak = (text: string, lang: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; // 'zh-CN' works well, Burmese support varies widely in browsers
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="relative w-full max-w-md h-96 perspective-1000 cursor-pointer group"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side - English */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center p-8 select-none">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-full mb-6 uppercase tracking-wider">
            {data.category || 'Vocabulary'}
          </span>
          <h3 className="text-3xl font-bold text-slate-800 leading-tight">
            {data.english}
          </h3>
          <p className="mt-8 text-slate-400 text-sm font-medium">Tap to reveal translations</p>
        </div>

        {/* Back Side - Burmese & Chinese */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
          
          {/* Burmese Section */}
          <div className="w-full mb-6 pb-6 border-b border-emerald-200/50">
            <p className="text-xs text-emerald-600 font-bold uppercase mb-2 tracking-widest">Burmese</p>
            <h4 className="text-3xl font-burmese text-slate-800 mb-2 leading-relaxed">{data.burmese}</h4>
            <p className="text-emerald-700 font-medium italic">{data.burmesePronunciation}</p>
          </div>

          {/* Chinese Section */}
          <div className="w-full relative">
            <button 
                onClick={(e) => handleSpeak(data.chinese, 'zh-CN', e)}
                className="absolute right-0 top-0 p-1.5 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-full transition-all"
                title="Listen to Chinese"
            >
                <Volume2 className="w-4 h-4" />
            </button>
            <p className="text-xs text-emerald-600 font-bold uppercase mb-2 tracking-widest">Chinese</p>
            <h4 className="text-3xl font-chinese text-slate-800 mb-2">{data.chinese}</h4>
            <p className="text-emerald-700 font-medium">{data.chinesePinyin}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Flashcard;