import { accuracy } from '../math/adaptiveEngine.js';

export default function Dashboard({ profile }) {
  const weakFacts = profile.weakFacts.length ? profile.weakFacts : ['Play a round to discover focus facts'];
  return (
    <section id="dashboard" className="panel dashboard">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Dad Mode</p>
          <h2>Parent Dashboard</h2>
        </div>
        <span className="badge">Level {profile.level}</span>
      </div>
      <div className="dashboard-grid">
        <div className="metric"><strong>{accuracy(profile)}%</strong><span>Accuracy</span></div>
        <div className="metric"><strong>{profile.total}</strong><span>Problems</span></div>
        <div className="metric"><strong>{profile.bananas}</strong><span>Bananas</span></div>
        <div className="metric"><strong>{profile.shinyRocks}</strong><span>Shiny Rocks</span></div>
      </div>
      <div className="focus-box">
        <h3>Focus facts</h3>
        <div className="chips">
          {weakFacts.map((fact) => <span key={fact}>{fact}</span>)}
        </div>
      </div>
    </section>
  );
}
