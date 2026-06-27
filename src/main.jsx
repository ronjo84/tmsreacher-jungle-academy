import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Trophy, Flame, Banana, RotateCcw, Sparkles, Target, Medal, Gem, Map, PawPrint, Shield, Bolt, Youtube } from 'lucide-react';
import './styles.css';

const BRAND = {
  player: 'Monke',
  channel: 'TMS REACHER',
  mascot: 'purple gorilla',
  pet: 'Tiny purple dog',
  boss: 'Giant purple monkey with red eyes',
  home: 'Waterfall Treehouse',
};

const MAPS = [
  { name: 'Waterfall Treehouse', unlockAt: 0, vibe: 'Home base and daily missions' },
  { name: 'Jungle Trail', unlockAt: 150, vibe: 'Mixed facts under the vines' },
  { name: 'Moonlit Canopy', unlockAt: 400, vibe: 'Speed rounds and streak climbs' },
  { name: 'Crystal Cave', unlockAt: 800, vibe: 'Shiny rock challenges' },
  { name: 'Red-Eye Ruins', unlockAt: 1300, vibe: 'Boss battle arena' },
];

const CONCEPTS = [
  { id: 'mul_assess', title: 'Mixed Multiplication Assessment', ops: ['×'], min: 0, max: 12, gate: 0.78 },
  { id: 'mul_focus', title: 'Targeted Multiplication Climb', ops: ['×'], min: 0, max: 12, gate: 0.88 },
  { id: 'div_bridge', title: 'Division Vine Bridge', ops: ['÷'], min: 1, max: 12, gate: 0.86 },
  { id: 'all_mixed', title: 'All Math Jungle Run', ops: ['+', '-', '×', '÷'], min: 1, max: 12, gate: 0.88 }
];

const DEFAULT = {
  player: 'Monke',
  xp: 0,
  shinyRocks: 0,
  bananas: 0,
  energy: 5,
  streak: 0,
  lastPlayDate: '',
  currentConcept: 0,
  history: [],
  badges: [],
  modePref: 'both',
  videoUrl: '',
};

function todayKey() { return new Date().toISOString().slice(0, 10); }
function load() { try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem('tmsReacherJungleAcademy') || '{}') }; } catch { return DEFAULT; } }
function save(state) { localStorage.setItem('tmsReacherJungleAcademy', JSON.stringify(state)); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeProblem(concept, weakFacts = {}, timed = false) {
  const op = choice(concept.ops);
  let a = rand(concept.min, concept.max);
  let b = rand(0, 12);
  const weak = Object.keys(weakFacts).filter(k => weakFacts[k] >= 2);
  if (op === '×' && weak.length && Math.random() < 0.68) {
    const [x, y] = choice(weak).split('x').map(Number);
    a = x; b = y;
  }
  if (timed && op === '×' && Math.random() < 0.25) b = rand(6, 12);
  if (op === '+') return { text: `${a} + ${b}`, answer: a + b, fact: `add_${a}_${b}` };
  if (op === '-') { const big = Math.max(a, b), small = Math.min(a, b); return { text: `${big} - ${small}`, answer: big - small, fact: `sub_${big}_${small}` }; }
  if (op === '÷') { const divisor = rand(1, 12), quotient = rand(1, 12); return { text: `${divisor * quotient} ÷ ${divisor}`, answer: quotient, fact: `div_${divisor * quotient}_${divisor}` }; }
  return { text: `${a} × ${b}`, answer: a * b, fact: `${a}x${b}` };
}

function masteryFor(history, conceptId) {
  const recent = history.filter(h => h.conceptId === conceptId).slice(-24);
  if (!recent.length) return { accuracy: 0, count: 0, mastered: false };
  const accuracy = recent.filter(h => h.correct).length / recent.length;
  return { accuracy, count: recent.length, mastered: recent.length >= 14 && accuracy >= 0.86 };
}

function App() {
  const [state, setState] = useState(load);
  const [runType, setRunType] = useState('relaxed');
  const concept = CONCEPTS[state.currentConcept];
  const weakFacts = useMemo(() => {
    const misses = {};
    state.history.slice(-90).forEach(h => { if (!h.correct && h.fact?.includes('x')) misses[h.fact] = (misses[h.fact] || 0) + 1; });
    return misses;
  }, [state.history]);
  const [problem, setProblem] = useState(() => makeProblem(concept, weakFacts));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('Welcome to the Waterfall Treehouse. Collect shiny rocks, unlock maps, and train mixed multiplication.');

  function commit(next) { setState(next); save(next); }
  function checkAnswer(e) {
    e.preventDefault();
    if (answer.trim() === '') return;
    const correct = Number(answer) === problem.answer;
    const date = todayKey();
    const firstToday = state.lastPlayDate !== date;
    const xpGain = correct ? (runType === 'timed' ? 15 : 10) : 2;
    const rocksGain = correct ? (runType === 'timed' ? 8 : 5) : 1;
    const newHistory = [...state.history, { conceptId: concept.id, fact: problem.fact, correct, at: new Date().toISOString(), runType }].slice(-500);
    const stats = masteryFor(newHistory, concept.id);
    let currentConcept = state.currentConcept;
    let badges = [...state.badges];
    let energy = Math.max(0, state.energy - 1);
    let msg = correct ? `Tagged it! +${xpGain} XP, +${rocksGain} shiny rocks, +1 banana.` : `Vine slip. The answer was ${problem.answer}. Monke learns from every miss.`;

    if (stats.count >= 14 && stats.accuracy >= concept.gate && state.currentConcept < CONCEPTS.length - 1) {
      currentConcept += 1;
      const badge = `Mastered ${concept.title}`;
      if (!badges.includes(badge)) badges.push(badge);
      msg = `Map unlocked! ${CONCEPTS[currentConcept].title} is open.`;
    }

    if (firstToday && !badges.includes('Daily Jungle Check-In')) badges.push('Daily Jungle Check-In');

    const next = {
      ...state,
      xp: state.xp + xpGain + (firstToday ? 30 : 0),
      shinyRocks: state.shinyRocks + rocksGain + (firstToday ? 20 : 0),
      bananas: state.bananas + (correct ? 1 : 0) + (firstToday ? 5 : 0),
      energy,
      streak: firstToday ? state.streak + 1 : state.streak,
      lastPlayDate: date,
      history: newHistory,
      currentConcept,
      badges
    };
    commit(next);
    setFeedback(firstToday ? `${msg} Daily bonus chest: +30 XP, +20 shiny rocks, +5 bananas.` : msg);
    setAnswer('');
    setProblem(makeProblem(CONCEPTS[currentConcept], weakFacts, runType === 'timed'));
  }
  function restoreEnergy() { commit({ ...state, energy: Math.min(5, state.energy + 3), shinyRocks: Math.max(0, state.shinyRocks - 15) }); setFeedback('Energy restored. Tiny purple dog is doing zoomies.'); }
  function reset() { localStorage.removeItem('tmsReacherJungleAcademy'); window.location.reload(); }
  const stats = masteryFor(state.history, concept.id);
  const level = Math.floor(state.xp / 120) + 1;
  const progress = Math.min(100, Math.round(stats.accuracy * 100));
  const recent = state.history.slice(-12);
  const recentAcc = recent.length ? Math.round((recent.filter(h => h.correct).length / recent.length) * 100) : 0;
  const hardest = Object.entries(weakFacts).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return <main className="shell">
    <section className="hero card">
      <div className="brandMark"><div className="play">▶</div><div><p className="eyebrow">{BRAND.channel}</p><h1>Jungle Academy</h1></div></div>
      <div className="heroCopy"><p><b>{BRAND.player}</b> trains in the Waterfall Treehouse with a tiny purple dog, earning shiny rocks and unlocking maps through mixed multiplication.</p></div>
      <div className="ape" aria-hidden="true"><span className="eyes">● ●</span>🦍<small>🐕</small></div>
    </section>

    <section className="stats">
      <Stat icon={<Trophy />} label="Level" value={level} />
      <Stat icon={<Gem />} label="Shiny Rocks" value={state.shinyRocks} />
      <Stat icon={<Flame />} label="Daily Streak" value={state.streak} />
      <Stat icon={<Bolt />} label="Energy" value={`${state.energy}/5`} />
    </section>

    <section className="grid">
      <div className="card game">
        <div className="row"><span className="pill">{runType === 'timed' ? 'Timed run' : 'Relaxed run'}</span><span>{concept.title}</span></div>
        <div className="toggle"><button className={runType==='relaxed'?'selected':''} onClick={()=>setRunType('relaxed')}>Relaxed</button><button className={runType==='timed'?'selected':''} onClick={()=>setRunType('timed')}>Timed</button></div>
        <h2>{problem.text} = ?</h2>
        <form onSubmit={checkAnswer} className="answerBox">
          <input autoFocus inputMode="numeric" value={answer} onChange={e => setAnswer(e.target.value.replace(/[^0-9-]/g, ''))} placeholder="type answer" />
          <button>Tag!</button>
        </form>
        <p className="feedback">{feedback}</p>
        <button className="energy" onClick={restoreEnergy} disabled={state.shinyRocks < 15}>Restore energy: 15 rocks</button>
      </div>

      <div className="card panel">
        <h3><Map size={18}/> Unlockable maps</h3>
        <div className="zones">{MAPS.map((m, i) => <div key={m.name} className={state.xp >= m.unlockAt ? 'done' : ''}><b>{state.xp >= m.unlockAt ? '✓' : '🔒'} {m.name}</b><span>{m.vibe}</span></div>)}</div>
      </div>

      <div className="card panel">
        <h3><Target size={18}/> Parent dashboard</h3>
        <p>Current mastery: <b>{progress}%</b> across {stats.count} recent attempts.</p>
        <div className="bar"><span style={{width: `${progress}%`}} /></div>
        <p>Recent accuracy: <b>{recentAcc}%</b>.</p>
        <p><b>Practice radar:</b> {hardest.length ? hardest.map(([f])=>f.replace('x','×')).join(', ') : 'No slippery facts yet.'}</p>
      </div>

      <div className="card panel">
        <h3><Shield size={18}/> Boss preview</h3>
        <p>The first boss is a <b>{BRAND.boss}</b>. Correct answers lower its power. Energy restore is Monke's first power-up.</p>
        <div className="boss">🙈<span>● ●</span></div>
      </div>

      <div className="card panel">
        <h3><Medal size={18}/> Rewards</h3>
        <p>Bananas are collectibles. Shiny rocks buy energy restores now and cosmetics later.</p>
        {state.badges.length ? <ul>{state.badges.map(b => <li key={b}>🏅 {b}</li>)}</ul> : <p className="muted">No badges yet. First badge is hiding behind the waterfall.</p>}
        <button className="ghost" onClick={reset}><RotateCcw size={16}/> Reset demo progress</button>
      </div>

      <div className="card panel youtube">
        <h3><Youtube size={18}/> TMS REACHER TV</h3>
        <p>Future home for embedded channel videos, launch codes, and subscriber milestone rewards.</p>
      </div>
    </section>
  </main>;
}

function Stat({ icon, label, value }) { return <div className="stat card">{icon}<div><b>{value}</b><span>{label}</span></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
