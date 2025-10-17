"use client";

import React, { useState, useEffect } from "react";
import { Word } from "@/types";
import { getWordsForReview, updateWord } from "@/utils/storage";
import { moveWordToNextBox } from "@/utils/spacedRepetition";
import Flashcard from "./Flashcard";
import { useTranslations } from "next-intl";

interface ReviewSessionProps {
  boxId: number;
  onComplete: () => void;
}

const ReviewSession: React.FC<ReviewSessionProps> = ({ boxId, onComplete }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  });
  const t = useTranslations();

  useEffect(() => {
    const dueWords = getWordsForReview(boxId);
    // Fallback: if no due words, practice all words in the box
    const fallbackAll = () => {
      const all = (
        JSON.parse(localStorage.getItem("ebbinghaus-words") || "[]") as any[]
      ).filter((w) => w.box === boxId);
      return all.map((w) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        lastReviewed: new Date(w.lastReviewed),
      }));
    };

    const source = dueWords.length > 0 ? dueWords : fallbackAll();
    // Shuffle words for random order
    const shuffledWords = [...source].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
    setSessionStats((prev) => ({ ...prev, total: shuffledWords.length }));
  }, [boxId]);

  const handleAnswer = (isCorrect: boolean) => {
    if (words.length === 0) return;

    const currentWord = words[currentIndex];
    const updatedWord = moveWordToNextBox(currentWord, isCorrect);
    updateWord(updatedWord);

    setSessionStats((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Session completed
      onComplete();
    }
  };

  if (words.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="card-title text-2xl justify-center">
            {t("common.reviewComplete")}
          </h2>
          <p className="opacity-70 mb-6">{t("messages.noWordsToReview")}</p>
          <div className="card-actions justify-center">
            <button onClick={onComplete} className="btn btn-primary">
              {t("common.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentIndex >= words.length) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="card-title text-2xl justify-center">
            {t("common.reviewComplete")}
          </h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow mb-6">
            <div className="stat">
              <div className="stat-title">{t("common.correct")}</div>
              <div className="stat-value text-success">
                {sessionStats.correct}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">{t("common.incorrect")}</div>
              <div className="stat-value text-error">
                {sessionStats.incorrect}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">{t("common.total")}</div>
              <div className="stat-value text-primary">
                {sessionStats.total}
              </div>
            </div>
          </div>
          <div className="card-actions justify-center">
            <button onClick={onComplete} className="btn btn-primary">
              {t("common.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm opacity-70 mb-2">
          {currentIndex + 1} / {words.length}
        </div>
        <progress
          className="progress progress-primary w-full"
          value={currentIndex + 1}
          max={words.length}
        ></progress>
      </div>

      <Flashcard
        word={words[currentIndex]}
        isReversed={false}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
};

export default ReviewSession;
