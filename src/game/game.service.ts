import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type FeedbackType = 'correct' | 'present' | 'absent';

function loadWords(): string[] {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'dist', 'game', 'termo.txt'),
    path.join(cwd, 'src', 'game', 'termo.txt'),
  ];
  try {
    const termoPath = candidates.find((p) => fs.existsSync(p)) || candidates[0];
    const content = fs.readFileSync(termoPath, 'utf-8');
    return content
      .split(/\r?\n/)
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length === 5);
  } catch {
    return ['termo', 'palavra', 'letra', 'jogar', 'acerto'];
  }
}

@Injectable()
export class GameService {
  private readonly wordsSet: Set<string>;
  private readonly wordsList: string[];

  constructor() {
    const rawWords = loadWords();
    this.wordsSet = new Set(
      rawWords.map((w) => w.normalize('NFD').replace(/\p{Diacritic}/gu, '')),
    );
    this.wordsList = rawWords.map((w) =>
      w.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
    );
  }

  getDailyWord(): string {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    const index = Math.abs(hash) % this.wordsList.length;
    return this.wordsList[index];
  }

  normalize(word: string): string {
    return word
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  isValidWord(word: string): boolean {
    const normalized = this.normalize(word);
    return normalized.length === 5 && this.wordsSet.has(normalized);
  }

  getRandomSeed(): number {
    return Math.floor(Math.random() * this.wordsList.length);
  }

  getWordBySeed(seed: number): string {
    const index = Number(seed);
    if (Number.isNaN(index) || index < 0 || index >= this.wordsList.length) {
      return this.getDailyWord();
    }
    return this.wordsList[index];
  }

  checkGuess(
    guess: string,
    seed: number | null = null,
  ): { valid: false } | { valid: true; feedback: FeedbackType[]; win: boolean } {
    const normalizedGuess = this.normalize(guess);
    if (normalizedGuess.length !== 5) {
      return { valid: false };
    }
    if (!this.wordsSet.has(normalizedGuess)) {
      return { valid: false };
    }

    const targetWord =
      seed != null ? this.getWordBySeed(seed) : this.getDailyWord();
    const feedback: FeedbackType[] = new Array(5).fill('absent');
    const targetCount: Record<string, number> = {};
    const guessCount: Record<string, number> = {};

    for (let i = 0; i < 5; i++) {
      const c = targetWord[i];
      targetCount[c] = (targetCount[c] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
      if (normalizedGuess[i] === targetWord[i]) {
        feedback[i] = 'correct';
        guessCount[normalizedGuess[i]] =
          (guessCount[normalizedGuess[i]] || 0) + 1;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (feedback[i] === 'correct') continue;
      const c = normalizedGuess[i];
      const inWord = targetWord.includes(c);
      const used = guessCount[c] || 0;
      if (inWord && used < targetCount[c]) {
        feedback[i] = 'present';
        guessCount[c] = used + 1;
      }
    }

    return {
      valid: true,
      feedback,
      win: normalizedGuess === targetWord,
    };
  }
}
