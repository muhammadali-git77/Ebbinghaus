"use client";

import React, { useState } from "react";
import { addWord } from "@/utils/storage";
import { useTranslations } from "next-intl";

interface AddWordFormProps {
  onWordAdded: () => void;
}

const AddWordForm: React.FC<AddWordFormProps> = ({ onWordAdded }) => {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim() || !translation.trim()) {
      alert(t("messages.enterWordAndTranslation"));
      return;
    }

    setIsSubmitting(true);

    try {
      addWord(word.trim(), translation.trim());
      setWord("");
      setTranslation("");
      onWordAdded();
    } catch (error) {
      console.error("Error adding word:", error);
      alert(t("messages.errorAddingWord"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{t("common.addNewWord")}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="word" className="label">
              <span className="label-text">{t("common.englishWord")}</span>
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="input input-bordered w-full"
              placeholder="beautiful"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="translation" className="label">
              <span className="label-text">{t("common.uzbekTranslation")}</span>
            </label>
            <input
              type="text"
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="input input-bordered w-full"
              placeholder="chiroyli, go'zal"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="card-actions justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary w-full ${
                isSubmitting ? "loading" : ""
              }`}
            >
              {isSubmitting ? t("common.addWord") : t("common.addWord")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordForm;
