import { cosmetics, maps } from '../data/maps.js';

export default function WorldMap() {
  return (
    <section className="world-grid">
      <div className="panel">
        <p className="eyebrow">Unlockable Maps</p>
        <h2>Jungle World</h2>
        <div className="map-list">
          {maps.map((map) => (
            <article className="map-card" key={map.name}>
              <div className="map-emoji">{map.emoji}</div>
              <div><strong>{map.name}</strong><span>{map.skill}</span></div>
              <small>{map.status}</small>
            </article>
          ))}
        </div>
      </div>
      <div className="panel">
        <p className="eyebrow">Shop Preview</p>
        <h2>Shiny Rock Store</h2>
        <div className="shop-list">
          {cosmetics.map((item) => (
            <article className="shop-card" key={item.name}>
              <span>{item.emoji}</span>
              <strong>{item.name}</strong>
              <small>{item.cost} 🪨</small>
            </article>
          ))}
        </div>
        <div className="boss-card">
          <span>👹</span>
          <div><strong>First Boss</strong><p>Giant purple monkey with red eyes. Correct answers lower its power.</p></div>
        </div>
      </div>
    </section>
  );
}
