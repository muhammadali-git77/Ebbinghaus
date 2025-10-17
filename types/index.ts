export interface Word {
  id: string;
  word: string;
  translation: string;
  box: number; // 1-5
  createdAt: Date;
  lastReviewed: Date;
  correctCount: number;
  incorrectCount: number;
}

export interface Box {
  id: number;
  name: string;
  interval: string;
  color: string;
}

export interface AnswerResult {
  isCorrect: boolean;
  isSynonym?: boolean;
  message: string;
}

export const BOXES: Box[] = [
  {
    id: 1,
    name: "Every hour",
    interval: "1 hour",
    color: "bg-red-100 border-red-300",
  },
  {
    id: 2,
    name: "Five hours",
    interval: "5 hours",
    color: "bg-orange-100 border-orange-300",
  },
  {
    id: 3,
    name: "Every day",
    interval: "1 day",
    color: "bg-yellow-100 border-yellow-300",
  },
  {
    id: 4,
    name: "Five days",
    interval: "5 days",
    color: "bg-green-100 border-green-300",
  },
  {
    id: 5,
    name: "Every month",
    interval: "1 month",
    color: "bg-blue-100 border-blue-300",
  },
];


