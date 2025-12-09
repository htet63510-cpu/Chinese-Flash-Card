export interface FlashcardData {
  english: string;
  burmese: string;
  burmesePronunciation: string;
  chinese: string;
  chinesePinyin: string;
  category: string;
}

export interface GenerationConfig {
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export enum CardSide {
  FRONT = 'FRONT',
  BACK = 'BACK'
}