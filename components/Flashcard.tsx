"use client";

import React, { useState, useEffect } from "react";
import { Word, AnswerResult } from "@/types";
import { checkAnswer } from "@/utils/answerChecker";
import { useTranslations } from "next-intl";

interface FlashcardProps {
  word: Word;
  isReversed: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  word,
  isReversed,
  onAnswer,
  onNext,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentReversed, setCurrentReversed] = useState(isReversed);
  const t = useTranslations();

  // Randomly decide if this card should be reversed
  React.useEffect(() => {
    setCurrentReversed(Math.random() < 0.5);
  }, [word.id]);

  const question = currentReversed ? word.translation : word.word;
  const correctAnswer = currentReversed ? word.word : word.translation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userAnswer.trim()) {
      alert(t("messages.enterAnswer"));
      return;
    }

    const answerResult = checkAnswer(
      userAnswer,
      correctAnswer,
      currentReversed
    );
    setResult(answerResult);
    setShowAnswer(true);
    onAnswer(answerResult.isCorrect);
  };

  const handleNext = () => {
    setUserAnswer("");
    setShowAnswer(false);
    setResult(null);
    setIsFlipped(!isFlipped);
    // Randomly decide for next card
    setCurrentReversed(Math.random() < 0.5);
    onNext();
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setResult({
      isCorrect: false,
      message: t("messages.wrongAnswer", { answer: correctAnswer }),
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <div className="text-center mb-6">
          <div className="text-sm opacity-70 mb-2">
            {currentReversed
              ? t("common.findTranslation")
              : t("common.translateWord")}
          </div>
          <div className="text-3xl font-bold">{question}</div>
        </div>

        {!showAnswer ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="input input-bordered text-center text-lg"
                placeholder={t("common.enterAnswer")}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary flex-1">
                {t("common.check")}
              </button>
              <button
                type="button"
                onClick={handleShowAnswer}
                className="btn btn-outline flex-1"
              >
                {t("common.showAnswer")}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div
              className={`alert ${
                result?.isCorrect ? "alert-success" : "alert-error"
              }`}
            >
              <div className="text-lg font-medium">{result?.message}</div>
              {!result?.isCorrect && (
                <div className="text-sm">
                  {t("common.correct")}:{" "}
                  <span className="font-semibold">{correctAnswer}</span>
                </div>
              )}
            </div>

            <button onClick={handleNext} className="btn btn-primary w-full">
              {t("common.next")}
            </button>
          </div>
        )}

        <div className="stats stats-horizontal shadow mt-4">
          <div className="stat py-2">
            <div className="stat-title text-xs">{t("common.correct")}</div>
            <div className="stat-value text-sm text-success">
              {word.correctCount}
            </div>
          </div>
          <div className="stat py-2">
            <div className="stat-title text-xs">{t("common.incorrect")}</div>
            <div className="stat-value text-sm text-error">
              {word.incorrectCount}
            </div>
          </div>
          <div className="stat py-2">
            <div className="stat-title text-xs">Box</div>
            <div className="stat-value text-sm">{word.box}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
