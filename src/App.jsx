import { useEffect, useState } from 'react';
import Hero from './components/Hero.jsx';
import PracticeArena from './components/PracticeArena.jsx';
import Dashboard from './components/Dashboard.jsx';
import WorldMap from './components/WorldMap.jsx';

const defaultProfile = {
  level: 1,
  xp: 0,
  shinyRocks: 120,
  bananas: 0,
  energy: 85,
  answerStreak: 0,
  correct: 0,
  total: 0,
  weakFacts: [],
  mastery: {}
};

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem('tmsreacher-profile')) || defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    localStorage.setItem('tmsreacher-profile', JSON.stringify(profile));
  }, [profile]);

  function resetProgress() {
    setProfile(defaultProfile);
  }

  return (
    <main className="app-shell">
      <nav className="top-nav">
        <div className="brand-mark">▶ TMS REACHER</div>
        <div className="nav-stats"><span>🪨 {profile.shinyRocks}</span><span>🍌 {profile.bananas}</span><span>⭐ L{profile.level}</span></div>
      </nav>
      <Hero profile={profile} />
      <PracticeArena profile={profile} setProfile={setProfile} />
      <WorldMap />
      <Dashboard profile={profile} />
      <section className="panel footer-panel">
        <h2>Next Builds</h2>
        <p>Firebase accounts, YouTube video feed, boss battle animations, character creator, and a family leaderboard.</p>
        <button className="ghost-btn" onClick={resetProgress}>Reset local progress</button>
      </section>
    </main>
  );
}
