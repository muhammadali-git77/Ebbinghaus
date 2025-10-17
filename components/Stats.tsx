"use client";

import React from "react";
import { Word } from "@/types";
import { getBoxStats } from "@/utils/spacedRepetition";
import { useTranslations } from "next-intl";

interface StatsProps {
  words: Word[];
}

const Stats: React.FC<StatsProps> = ({ words }) => {
  const boxStats = getBoxStats(words);
  const totalWords = words.length;
  const totalCorrect = words.reduce((sum, word) => sum + word.correctCount, 0);
  const totalIncorrect = words.reduce(
    (sum, word) => sum + word.incorrectCount,
    0
  );
  const t = useTranslations();

  const getBoxName = (boxId: number) => {
    const names = {
      1: t("stats.box1"),
      2: t("stats.box2"),
      3: t("stats.box3"),
      4: t("stats.box4"),
      5: t("stats.box5"),
    };
    return names[boxId as keyof typeof names] || `Box ${boxId}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">{t("common.statistics")}</h2>

        <div className="space-y-6">
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">{t("stats.totalWords")}</div>
              <div className="stat-value text-primary">{totalWords}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">{t("stats.correctAnswers")}</div>
              <div className="stat-value text-secondary">{totalCorrect}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H19a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">{t("stats.incorrectAnswers")}</div>
              <div className="stat-value text-accent">{totalIncorrect}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("common.boxDistribution")}
            </h3>
            <div className="space-y-2">
              {Object.entries(boxStats).map(([boxId, count]) => (
                <div
                  key={boxId}
                  className="flex justify-between items-center p-3 bg-base-200 rounded-lg"
                >
                  <span className="text-sm">{getBoxName(parseInt(boxId))}</span>
                  <div className="badge badge-primary badge-lg">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {totalWords > 0 && <div className="divider"></div>}

          {totalWords > 0 && (
            <div className="text-center">
              <div className="text-sm opacity-70">
                {t("common.successRate")}:{" "}
                <span className="font-bold text-lg">
                  {Math.round(
                    (totalCorrect / (totalCorrect + totalIncorrect)) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
