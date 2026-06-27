import { useEffect, useState } from 'react';
import { createProblem, updateProfile } from '../math/adaptiveEngine.js';

export default function PracticeArena({ profile, setProfile }) {
  const [mode, setMode] = useState('relaxed');
  const [problem, setProblem] = useState(() => createProblem(profile));
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('Solve the vine gate to move through the jungle.');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (mode !== 'timed') return;
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(id);
  }, [mode, timeLeft]);

  function submitAnswer(event) {
    event.preventDefault();
    const wasCorrect = Number(input) === problem.answer;
    const nextProfile = updateProfile(profile, problem, wasCorrect);
    setProfile(nextProfile);
    setMessage(wasCorrect ? 'Correct! The vine swings open. +8 Shiny Rocks' : `Close! ${problem.a} × ${problem.b} = ${problem.answer}. Monke will see this fact again soon.`);
    setProblem(createProblem(nextProfile));
    setInput('');
  }

  function restoreEnergy() {
    setProfile({ ...profile, energy: 100, shinyRocks: Math.max(0, profile.shinyRocks - 25) });
    setMessage('Energy restored. Monke is ready to climb again.');
  }

  return (
    <section id="practice" className="panel arena">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Adaptive Practice</p>
          <h2>Jungle Vine Challenge</h2>
        </div>
        <div className="toggle-group">
          <button className={mode === 'relaxed' ? 'active' : ''} onClick={() => setMode('relaxed')}>Relaxed</button>
          <button className={mode === 'timed' ? 'active' : ''} onClick={() => { setMode('timed'); setTimeLeft(60); }}>Timed</button>
        </div>
      </div>
      <div className="challenge-card">
        <div className="problem">{problem.a} × {problem.b}</div>
        <form onSubmit={submitAnswer} className="answer-form">
          <input inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Answer" autoFocus />
          <button type="submit">Tag it</button>
        </form>
        <p className="message">{message}</p>
        {mode === 'timed' && <p className="timer">⏱ {timeLeft}s left</p>}
      </div>
      <div className="stat-row">
        <span>⚡ Energy {profile.energy}%</span>
        <span>🔥 Streak {profile.answerStreak}</span>
        <button className="mini-btn" onClick={restoreEnergy}>Restore Energy, 25 🪨</button>
      </div>
    </section>
  );
}
