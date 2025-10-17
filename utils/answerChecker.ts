import { AnswerResult } from "@/types";

// Normalize text: lowercase, remove punctuation, collapse spaces
const normalizeText = (input: string): string => {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/["'`’”“]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Basic Damerau-Levenshtein distance implementation
const editDistance = (a: string, b: string): number => {
  const n = a.length;
  const m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost); // transposition
      }
    }
  }
  return dp[n][m];
};

const isFuzzyEqual = (a: string, b: string): boolean => {
  const x = normalizeText(a);
  const y = normalizeText(b);
  if (x === y) return true;
  const distance = editDistance(x, y);
  const len = Math.max(x.length, y.length);
  // Allow small typos depending on length
  const threshold = len <= 5 ? 1 : len <= 8 ? 2 : 3;
  return distance <= threshold;
};

// Split multiple synonyms separated by , ; / |
const splitCandidates = (text: string): string[] => {
  return normalizeText(text)
    .split(/[;,/|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
};

export const checkAnswer = (
  userAnswer: string,
  correctAnswer: string,
  isReversed: boolean = false
): AnswerResult => {
  const user = normalizeText(userAnswer);
  const correct = normalizeText(correctAnswer);

  // Prepare candidates: include provided correct answer segments and basic synonyms
  const providedCandidates = splitCandidates(correctAnswer);
  const basicSynonyms = getBasicSynonyms(correct);
  const candidates = Array.from(
    new Set([correct, ...providedCandidates, ...basicSynonyms])
  );

  // Check all candidates with fuzzy match
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (isFuzzyEqual(user, candidate)) {
      const exact = normalizeText(candidate) === user;
      return {
        isCorrect: true,
        isSynonym: !exact && normalizeText(candidate) !== correct,
        message: exact ? "To'g'ri! 🎉" : "Qabul qilindi (yaqin/sinonim). ✅",
      };
    }
  }

  // Also allow partial match for multi-word phrases
  if (user.length > 2 && (correct.includes(user) || user.includes(correct))) {
    return { isCorrect: true, message: "Yaxshi! 👍" };
  }

  return {
    isCorrect: false,
    message: `Noto'g'ri. To'g'ri javob: "${correctAnswer}"`,
  };
};

// Basic synonym dictionary (can be expanded or replaced with AI)
const getBasicSynonyms = (word: string): string[] => {
  const synonymMap: { [key: string]: string[] } = {
    good: [
      "great",
      "excellent",
      "wonderful",
      "amazing",
      "awesome",
      "fantastic",
    ],
    bad: ["terrible", "awful", "horrible", "poor", "lousy"],
    big: ["large", "huge", "enormous", "giant", "massive"],
    small: ["tiny", "little", "mini", "miniature", "petite"],
    happy: ["joyful", "cheerful", "glad", "pleased", "delighted"],
    sad: ["unhappy", "miserable", "depressed", "gloomy", "melancholy"],
    fast: ["quick", "rapid", "swift", "speedy", "brisk"],
    slow: ["sluggish", "leisurely", "gradual", "unhurried"],
    beautiful: ["pretty", "lovely", "gorgeous", "stunning", "attractive"],
    ugly: ["unattractive", "hideous", "repulsive", "disgusting"],
    smart: ["intelligent", "clever", "bright", "wise", "brilliant"],
    stupid: ["foolish", "dumb", "silly", "idiotic", "unintelligent"],
    easy: ["simple", "effortless", "straightforward", "uncomplicated"],
    difficult: ["hard", "challenging", "tough", "complex", "complicated"],
    new: ["fresh", "recent", "modern", "contemporary", "latest"],
    old: ["ancient", "aged", "elderly", "vintage", "antique"],
    hot: ["warm", "heated", "boiling", "scorching", "burning"],
    cold: ["cool", "chilly", "freezing", "frigid", "icy"],
    clean: ["tidy", "neat", "spotless", "pure", "immaculate"],
    dirty: ["filthy", "messy", "unclean", "soiled", "contaminated"],
  };

  return synonymMap[word] || [];
};
