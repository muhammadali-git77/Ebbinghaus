"use client";

import React, { useState, useEffect } from "react";
import { Word, BOXES } from "@/types";
import { loadWords } from "@/utils/storage";
import Box from "@/components/Box";
import AddWordForm from "@/components/AddWordForm";
import ReviewSession from "@/components/ReviewSession";
import Stats from "@/components/Stats";
import { ThemeToggle } from "./components/ThemeToggle";
import { LanguageSelector } from "./components/LanguageSelector";
import { useTranslations } from "next-intl";

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentView, setCurrentView] = useState<
    "main" | "add" | "review" | "stats"
  >("main");
  const [reviewBoxId, setReviewBoxId] = useState<number | null>(null);
  const t = useTranslations();

  useEffect(() => {
    // Only load words on client side
    if (typeof window !== "undefined") {
      const words = loadWords();
      console.log("Initial words loaded:", words);
      setWords(words);
    }
  }, []);

  const handleWordAdded = () => {
    // Force re-render by updating words state
    if (typeof window !== "undefined") {
      const updatedWords = loadWords();
      console.log("Words after adding:", updatedWords);
      setWords(updatedWords);
    }
    setCurrentView("main");
  };

  const handleStartReview = (boxId: number) => {
    setReviewBoxId(boxId);
    setCurrentView("review");
  };

  const handleReviewComplete = () => {
    if (typeof window !== "undefined") {
      setWords(loadWords());
    }
    setCurrentView("main");
    setReviewBoxId(null);
  };

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Ebbinghaus Spaced Repetition</h1>
        </div>
        <div className="flex-none gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-base-content/70">
          {t("common.translateWord")} - {t("common.findTranslation")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => setCurrentView("add")}
          className="btn btn-primary"
        >
          + {t("common.addWord")}
        </button>
        <button
          onClick={() => setCurrentView("stats")}
          className="btn btn-outline"
        >
          📊 {t("common.statistics")}
        </button>
      </div>

      {/* Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {BOXES.map((box) => (
          <Box
            key={box.id}
            box={box}
            words={words}
            onStartReview={handleStartReview}
          />
        ))}
      </div>

      {/* Quick Stats */}
      {words.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">{t("common.quickStats")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="stat">
                <div className="stat-value text-primary">{words.length}</div>
                <div className="stat-desc">{t("stats.totalWords")}</div>
              </div>
              <div className="stat">
                <div className="stat-value text-success">
                  {words.reduce((sum, word) => sum + word.correctCount, 0)}
                </div>
                <div className="stat-desc">{t("stats.correctAnswers")}</div>
              </div>
              <div className="stat">
                <div className="stat-value text-error">
                  {words.reduce((sum, word) => sum + word.incorrectCount, 0)}
                </div>
                <div className="stat-desc">{t("stats.incorrectAnswers")}</div>
              </div>
              <div className="stat">
                <div className="stat-value text-info">
                  {BOXES.reduce(
                    (sum, box) =>
                      sum + words.filter((w) => w.box === box.id).length,
                    0
                  )}
                </div>
                <div className="stat-desc">{t("common.wordsInBoxes")}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAddWordView = () => (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <button
          onClick={() => setCurrentView("main")}
          className="btn btn-outline"
        >
          ← {t("common.back")}
        </button>
      </div>
      <AddWordForm onWordAdded={handleWordAdded} />
    </div>
  );

  const renderStatsView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => setCurrentView("main")}
          className="btn btn-outline"
        >
          ← {t("common.back")}
        </button>
      </div>
      <Stats words={words} />
    </div>
  );

  const renderReviewView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <button onClick={handleReviewComplete} className="btn btn-outline">
          ← {t("common.back")}
        </button>
      </div>
      {reviewBoxId && (
        <ReviewSession boxId={reviewBoxId} onComplete={handleReviewComplete} />
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {currentView === "main" && renderMainView()}
      {currentView === "add" && renderAddWordView()}
      {currentView === "stats" && renderStatsView()}
      {currentView === "review" && renderReviewView()}
    </div>
  );
}
