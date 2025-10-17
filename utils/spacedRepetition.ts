import { Word } from "@/types";

export const moveWordToNextBox = (word: Word, isCorrect: boolean): Word => {
  const updatedWord = { ...word };
  updatedWord.lastReviewed = new Date();

  if (isCorrect) {
    updatedWord.correctCount += 1;

    // Move to next box based on spaced repetition logic
    switch (word.box) {
      case 1:
        updatedWord.box = 2; // Every hour → Five hours
        break;
      case 2:
        updatedWord.box = 3; // Five hours → Every day
        break;
      case 3:
        updatedWord.box = 4; // Every day → Five days
        break;
      case 4:
        updatedWord.box = 5; // Five days → Every month
        break;
      case 5:
        // Stay in box 5 (Every month)
        break;
      default:
        break;
    }
  } else {
    updatedWord.incorrectCount += 1;

    // Move to previous box or stay in current box
    switch (word.box) {
      case 1:
        // Stay in box 1
        break;
      case 2:
        updatedWord.box = 1; // Five hours → Every hour
        break;
      case 3:
        updatedWord.box = 2; // Every day → Five hours
        break;
      case 4:
        updatedWord.box = 3; // Five days → Every day
        break;
      case 5:
        updatedWord.box = 4; // Every month → Five days
        break;
      default:
        break;
    }
  }

  return updatedWord;
};

export const getBoxStats = (words: Word[]) => {
  const stats = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  words.forEach((word) => {
    stats[word.box as keyof typeof stats]++;
  });

  return stats;
};


