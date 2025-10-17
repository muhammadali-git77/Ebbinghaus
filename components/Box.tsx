"use client";

import React from "react";
import { Word, Box as BoxType } from "@/types";
import { getWordsForReviewFromList } from "@/utils/storage";
import { useTranslations } from "next-intl";

interface BoxProps {
  box: BoxType;
  words: Word[];
  onStartReview: (boxId: number) => void;
}

const Box: React.FC<BoxProps> = ({ box, words, onStartReview }) => {
  const boxWords = words.filter((word) => word.box === box.id);
  const wordsForReview = getWordsForReviewFromList(words, box.id);
  const t = useTranslations();

  // Debug logging
  console.log(`Box ${box.id}:`, {
    totalWords: words.length,
    boxWords: boxWords.length,
    wordsForReview: wordsForReview.length,
    boxWordsData: boxWords.map((w) => ({
      id: w.id,
      word: w.word,
      createdAt: w.createdAt,
      lastReviewed: w.lastReviewed,
      timeDiff: new Date().getTime() - new Date(w.lastReviewed).getTime(),
    })),
  });

  const getBoxName = (boxId: number) => {
    const names = {
      1: t("boxes.everyHour"),
      2: t("boxes.fiveHours"),
      3: t("boxes.everyDay"),
      4: t("boxes.fiveDays"),
      5: t("boxes.everyMonth"),
    };
    return names[boxId as keyof typeof names] || `Box ${boxId}`;
  };

  const getBoxInterval = (boxId: number) => {
    const intervals = {
      1: t("intervals.1hour"),
      2: t("intervals.5hours"),
      3: t("intervals.1day"),
      4: t("intervals.5days"),
      5: t("intervals.1month"),
    };
    return intervals[boxId as keyof typeof intervals] || "";
  };

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg">{getBoxName(box.id)}</h2>
        <p className="text-sm opacity-70">{getBoxInterval(box.id)}</p>

        <div className="stats stats-vertical shadow">
          <div className="stat py-2">
            <div className="stat-title text-xs">{t("stats.totalWords")}</div>
            <div className="stat-value text-lg">{boxWords.length}</div>
          </div>
          <div className="stat py-2">
            <div className="stat-title text-xs">{t("common.startReview")}</div>
            <div
              className={`stat-value text-lg ${
                wordsForReview.length > 0 ? "text-error" : "text-success"
              }`}
            >
              {wordsForReview.length}
            </div>
          </div>
        </div>

        <div className="card-actions justify-end">
          <button
            onClick={() => onStartReview(box.id)}
            disabled={boxWords.length === 0}
            className={`btn w-full ${
              boxWords.length > 0 ? "btn-primary" : "btn-disabled"
            }`}
          >
            {boxWords.length > 0
              ? t("common.startReview")
              : t("common.noReview")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Box;
