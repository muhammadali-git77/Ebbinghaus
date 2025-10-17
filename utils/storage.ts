import { Word } from "@/types";

const STORAGE_KEY = "ebbinghaus-words";

export const saveWords = (words: Word[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }
};

export const loadWords = (): Word[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const words = JSON.parse(stored);
      // Convert date strings back to Date objects
      return words.map((word: any) => ({
        ...word,
        createdAt: new Date(word.createdAt),
        lastReviewed: new Date(word.lastReviewed),
      }));
    }
  }
  return [];
};

export const addWord = (word: string, translation: string): Word => {
  const newWord: Word = {
    id: Date.now().toString(),
    word: word.trim(),
    translation: translation.trim(),
    box: 1,
    createdAt: new Date(),
    lastReviewed: new Date(),
    correctCount: 0,
    incorrectCount: 0,
  };

  const words = loadWords();
  words.push(newWord);
  saveWords(words);

  return newWord;
};

export const updateWord = (updatedWord: Word): void => {
  const words = loadWords();
  const index = words.findIndex((w) => w.id === updatedWord.id);
  if (index !== -1) {
    words[index] = updatedWord;
    saveWords(words);
  }
};

export const deleteWord = (wordId: string): void => {
  const words = loadWords();
  const filteredWords = words.filter((w) => w.id !== wordId);
  saveWords(filteredWords);
};

export const getWordsByBox = (boxId: number): Word[] => {
  const words = loadWords();
  return words.filter((word) => word.box === boxId);
};

export const getWordsForReview = (boxId: number): Word[] => {
  const words = getWordsByBox(boxId);
  const now = new Date();

  return words.filter((word) => {
    const lastReviewed = new Date(word.lastReviewed);
    const timeDiff = now.getTime() - lastReviewed.getTime();

    // For development/testing, allow immediate review for new words
    // In production, you might want to use actual time intervals
    const isNewWord = timeDiff < 60 * 1000; // Less than 1 minute = new word

    if (isNewWord) {
      return true; // Allow immediate review for new words
    }

    // Check if enough time has passed based on box interval
    switch (boxId) {
      case 1: // Every hour
        return timeDiff >= 60 * 60 * 1000; // 1 hour
      case 2: // Five hours
        return timeDiff >= 5 * 60 * 60 * 1000; // 5 hours
      case 3: // Every day
        return timeDiff >= 24 * 60 * 60 * 1000; // 1 day
      case 4: // Five days
        return timeDiff >= 5 * 24 * 60 * 60 * 1000; // 5 days
      case 5: // Every month
        return timeDiff >= 30 * 24 * 60 * 60 * 1000; // 30 days
      default:
        return false;
    }
  });
};

// New function that takes words as parameter
export const getWordsForReviewFromList = (
  words: Word[],
  boxId: number
): Word[] => {
  const boxWords = words.filter((word) => word.box === boxId);
  const now = new Date();

  return boxWords.filter((word) => {
    const lastReviewed = new Date(word.lastReviewed);
    const timeDiff = now.getTime() - lastReviewed.getTime();

    // For development/testing, allow immediate review for new words
    // Check if word was created recently (less than 1 minute ago) OR last reviewed recently
    const isNewWord = timeDiff < 60 * 1000; // Less than 1 minute = new word
    const isRecentlyCreated =
      now.getTime() - new Date(word.createdAt).getTime() < 60 * 1000;

    // Debug logging
    console.log(`Word ${word.word} (Box ${boxId}):`, {
      timeDiff,
      isNewWord,
      isRecentlyCreated,
      createdAt: word.createdAt,
      lastReviewed: word.lastReviewed,
      shouldReview: isNewWord || isRecentlyCreated,
    });

    if (isNewWord || isRecentlyCreated) {
      return true; // Allow immediate review for new words
    }

    // Check if enough time has passed based on box interval
    switch (boxId) {
      case 1: // Every hour
        return timeDiff >= 60 * 60 * 1000; // 1 hour
      case 2: // Five hours
        return timeDiff >= 5 * 60 * 60 * 1000; // 5 hours
      case 3: // Every day
        return timeDiff >= 24 * 60 * 60 * 1000; // 1 day
      case 4: // Five days
        return timeDiff >= 5 * 24 * 60 * 60 * 1000; // 5 days
      case 5: // Every month
        return timeDiff >= 30 * 24 * 60 * 60 * 1000; // 30 days
      default:
        return false;
    }
  });
};
