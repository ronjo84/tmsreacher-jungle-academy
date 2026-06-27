export function createProblem(profile) {
  const facts = [];
  for (let a = 2; a <= 12; a += 1) {
    for (let b = 2; b <= 12; b += 1) {
      const key = `${a}x${b}`;
      const mastery = profile.mastery[key] ?? 0;
      const weight = Math.max(1, 10 - mastery);
      for (let i = 0; i < weight; i += 1) facts.push([a, b]);
    }
  }
  const [a, b] = facts[Math.floor(Math.random() * facts.length)];
  return { a, b, answer: a * b, key: `${a}x${b}` };
}

export function updateProfile(profile, problem, wasCorrect) {
  const current = profile.mastery[problem.key] ?? 0;
  const nextMastery = Math.max(0, Math.min(10, current + (wasCorrect ? 1 : -1)));
  const xpGain = wasCorrect ? 15 : 3;
  const rocksGain = wasCorrect ? 8 : 1;
  const bananasGain = wasCorrect ? 1 : 0;
  const streak = wasCorrect ? profile.answerStreak + 1 : 0;
  const level = Math.floor((profile.xp + xpGain) / 150) + 1;

  return {
    ...profile,
    xp: profile.xp + xpGain,
    level,
    shinyRocks: profile.shinyRocks + rocksGain,
    bananas: profile.bananas + bananasGain,
    energy: Math.min(100, profile.energy + (wasCorrect ? 2 : -5)),
    answerStreak: streak,
    correct: profile.correct + (wasCorrect ? 1 : 0),
    total: profile.total + 1,
    mastery: { ...profile.mastery, [problem.key]: nextMastery },
    weakFacts: wasCorrect ? profile.weakFacts.filter((fact) => fact !== problem.key) : [...new Set([problem.key, ...profile.weakFacts])].slice(0, 8)
  };
}

export function accuracy(profile) {
  if (!profile.total) return 0;
  return Math.round((profile.correct / profile.total) * 100);
}
