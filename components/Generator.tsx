import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GenerationConfig } from '../types';

interface GeneratorProps {
  onGenerate: (config: GenerationConfig) => void;
  isLoading: boolean;
}

const TOPICS = [
  "Basic Greetings",
  "Numbers & Counting",
  "Ordering Food",
  "Asking Directions",
  "Family Members",
  "Emergency Phrases",
  "Shopping & Bargaining",
  "Time & Dates"
];

const Generator: React.FC<GeneratorProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<GenerationConfig['difficulty']>('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = customTopic.trim() || topic;
    if (finalTopic) {
      onGenerate({ topic: finalTopic, difficulty });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Deck</h2>
        <p className="text-slate-500">Choose a topic or enter your own to generate AI-powered flashcards.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Suggested Topics</label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTopic(t); setCustomTopic(''); }}
                className={`px-3 py-1.5 text-sm rounded-full transition-all border ${
                  topic === t && !customTopic
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-medium ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
           <label htmlFor="custom-topic" className="block text-sm font-semibold text-slate-700 mb-2">
             Or type your own
           </label>
           <input
             id="custom-topic"
             type="text"
             value={customTopic}
             onChange={(e) => { setCustomTopic(e.target.value); setTopic(''); }}
             placeholder="e.g., Medical terms, Business meeting..."
             className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-slate-800 placeholder:text-slate-400"
           />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`py-2 text-sm rounded-lg font-medium transition-colors border ${
                  difficulty === level
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!topic && !customTopic)}
          className="w-full py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-200 hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Flashcards
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Generator;