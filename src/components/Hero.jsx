export default function Hero({ profile }) {
  return (
    <section className="hero-card">
      <div className="youtube-pill"><span className="play">▶</span> TMS REACHER</div>
      <div className="hero-grid">
        <div>
          <p className="eyebrow">Waterfall Treehouse</p>
          <h1>TMS REACHER: Jungle Academy</h1>
          <p className="lede">Help Monke master math, collect Shiny Rocks, unlock jungle maps, and train with a tiny purple dog sidekick.</p>
          <div className="button-row">
            <a className="primary-btn" href="#practice">Start challenge</a>
            <a className="ghost-btn" href="#dashboard">Dad dashboard</a>
          </div>
        </div>
        <div className="monke-stage" aria-label="Monke character preview">
          <div className="waterfall"></div>
          <div className="monke">🦍</div>
          <div className="dog">🐶</div>
          <div className="floating-rocks">🪨 {profile.shinyRocks}</div>
        </div>
      </div>
    </section>
  );
}
