import React, { useEffect, useMemo, useState } from 'react';

const MOVIES = [
  { id: 1, title: 'Coco', year: 2017, minutes: 105, mood: 'Emoción', company: ['Familia', 'Amigos'], genre: 'Animación · Aventura', director: 'Lee Unkrich', score: '9.1', colors: 'coral', emoji: '🎸', tagline: 'La música nunca se olvida', description: 'Miguel sueña con ser músico y termina en una aventura inolvidable entre recuerdos, familia y canciones.' },
  { id: 2, title: 'Knives Out', year: 2019, minutes: 130, mood: 'Intriga', company: ['Amigos', 'En pareja'], genre: 'Misterio · Comedia', director: 'Rian Johnson', score: '8.7', colors: 'moss', emoji: '🔎', tagline: 'Todos tienen un motivo', description: 'Una reunión familiar, una muerte inesperada y un detective que sabe que cada detalle importa.' },
  { id: 3, title: 'Ratatouille', year: 2007, minutes: 111, mood: 'Ligera', company: ['Familia', 'Amigos'], genre: 'Animación · Comedia', director: 'Brad Bird', score: '9.0', colors: 'tomato', emoji: '🍲', tagline: 'Cualquiera puede cocinar', description: 'Una pequeña rata con un gran talento encuentra una forma inesperada de acercarse a la cocina parisina.' },
  { id: 4, title: 'The Martian', year: 2015, minutes: 144, mood: 'Aventura', company: ['Amigos', 'Solo'], genre: 'Ciencia ficción · Aventura', director: 'Ridley Scott', score: '8.5', colors: 'sand', emoji: '🪐', tagline: 'Traerlo de vuelta', description: 'Un astronauta queda solo en Marte y convierte cada problema en una oportunidad para sobrevivir.' },
  { id: 5, title: 'Inside Out', year: 2015, minutes: 95, mood: 'Emoción', company: ['Familia', 'Solo'], genre: 'Animación · Familiar', director: 'Pete Docter', score: '8.8', colors: 'lilac', emoji: '💭', tagline: 'Conoce lo que sientes', description: 'Alegría, Tristeza y las demás emociones intentan ayudar a Riley a adaptarse a una nueva etapa.' },
  { id: 6, title: 'Paddington 2', year: 2017, minutes: 104, mood: 'Ligera', company: ['Familia', 'En pareja'], genre: 'Comedia · Familiar', director: 'Paul King', score: '9.2', colors: 'blue', emoji: '🧸', tagline: 'Un oso, un libro y mil sonrisas', description: 'Paddington busca el regalo perfecto para su tía Lucy y termina en una aventura llena de buenos vecinos.' },
  { id: 7, title: 'Little Women', year: 2019, minutes: 135, mood: 'Romance', company: ['En pareja', 'Solo'], genre: 'Drama · Romance', director: 'Greta Gerwig', score: '8.6', colors: 'rose', emoji: '📖', tagline: 'Historias que crecen contigo', description: 'Cuatro hermanas imaginan futuros distintos mientras atraviesan juntas los cambios de la vida.' },
  { id: 8, title: 'Hidden Figures', year: 2016, minutes: 127, mood: 'Inspiración', company: ['Familia', 'Amigos'], genre: 'Drama · Historia', director: 'Theodore Melfi', score: '8.9', colors: 'night', emoji: '🚀', tagline: 'El talento no tiene límites', description: 'Tres matemáticas brillantes abren camino en la NASA y ayudan a cambiar la historia de la carrera espacial.' },
];

const MOODS = ['Cualquier ánimo', 'Ligera', 'Emoción', 'Intriga', 'Aventura', 'Romance', 'Inspiración'];
const COMPANIONS = ['Cualquiera', 'Familia', 'Amigos', 'En pareja', 'Solo'];
const RUNTIMES = [90, 120, 150];
const DEFAULT_FILTERS = { mood: 'Cualquier ánimo', company: 'Cualquiera', maxMinutes: 150, query: '' };

function readFavorites() {
  try { return JSON.parse(localStorage.getItem('planb-favoritas')) || []; }
  catch { return []; }
}

function Header({ favoritesCount, view, setView }) {
  return <header className="site-header"><a className="wordmark" href="#top" onClick={() => setView('all')}><span className="wordmark-icon">P<span>B</span></span><span>PLAN B<small>CINE EN CASA</small></span></a><nav><button className={view === 'all' ? 'nav-active' : ''} onClick={() => setView('all')}>Descubrir</button><button className={view === 'favorites' ? 'nav-active' : ''} onClick={() => setView('favorites')}>Mi lista <span className="count-pill">{favoritesCount}</span></button></nav><span className="header-mark">UNA BUENA PELI LO CAMBIA TODO <b>↗</b></span></header>;
}

function MoviePoster({ movie, compact = false }) {
  return <div className={`poster poster-${movie.colors} ${compact ? 'poster-compact' : ''}`}>
    <span className="poster-index">PLAN B · #{String(movie.id).padStart(2, '0')}</span>
    <span className="poster-emoji" aria-hidden="true">{movie.emoji}</span>
    <span className="poster-caption">{movie.tagline}</span>
    <span className="poster-title">{movie.title}</span>
    <span className="poster-year">{movie.year} <i>✳</i> {movie.genre.split(' · ')[0]}</span>
    <span className="poster-stamp">P</span>
  </div>;
}

function MovieCard({ movie, favorite, onFavorite, onDetails }) {
  return <article className="movie-card"><button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} aria-label={favorite ? `Quitar ${movie.title} de mi lista` : `Guardar ${movie.title}`} onClick={() => onFavorite(movie.id)}>{favorite ? '♥' : '♡'}</button><button className="poster-button" onClick={() => onDetails(movie)} aria-label={`Ver detalles de ${movie.title}`}><MoviePoster movie={movie} /></button><div className="movie-info"><div className="movie-title-row"><h3>{movie.title}</h3><span className="rating">★ {movie.score}</span></div><p>{movie.year} <span>·</span> {movie.minutes} min <span>·</span> {movie.genre}</p><div className="movie-card-bottom"><span className="mood-tag">{movie.mood}</span><button className="details-link" onClick={() => onDetails(movie)}>Ver detalles ↗</button></div></div></article>;
}

function DetailModal({ movie, favorite, onFavorite, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button><MoviePoster movie={movie} compact /><div className="modal-info"><p className="kicker">PLAN B TE PROPONE</p><h2 id="detail-title">{movie.title}</h2><p className="modal-meta">{movie.year} · {movie.minutes} min · Dir. {movie.director}</p><p className="modal-desc">{movie.description}</p><div className="modal-pills"><span>{movie.mood}</span>{movie.company.map((item) => <span key={item}>{item}</span>)}</div><button className="button button-dark" onClick={() => onFavorite(movie.id)}>{favorite ? '♥ Guardada en mi lista' : '♡ Guardar en mi lista'}</button></div></section></div>;
}

export default function App() {
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [favorites, setFavorites] = useState(readFavorites);
  const [view, setView] = useState('all');
  const [selected, setSelected] = useState(null);
  const [surpriseId, setSurpriseId] = useState(null);

  useEffect(() => {
    localStorage.setItem('planb-favoritas', JSON.stringify(favorites));
  }, [favorites]);

  const filteredMovies = useMemo(() => MOVIES.filter((movie) => {
    const matchesMood = filters.mood === 'Cualquier ánimo' || movie.mood === filters.mood;
    const matchesCompany = filters.company === 'Cualquiera' || movie.company.includes(filters.company);
    const matchesTime = movie.minutes <= filters.maxMinutes;
    const matchesQuery = `${movie.title} ${movie.genre} ${movie.mood}`.toLowerCase().includes(filters.query.toLowerCase().trim());
    const matchesView = view === 'all' || favorites.includes(movie.id);
    return matchesMood && matchesCompany && matchesTime && matchesQuery && matchesView;
  }), [filters, view, favorites]);

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function clearFilters() {
    setDraftFilters(DEFAULT_FILTERS); setFilters(DEFAULT_FILTERS); setView('all'); setSurpriseId(null);
  }
  function submitFilters(event) {
    event.preventDefault();
    setFilters({ ...draftFilters });
    setSurpriseId(null);
  }
  function surpriseMe() {
    if (filteredMovies.length) setSurpriseId(filteredMovies[Math.floor(Math.random() * filteredMovies.length)].id);
  }

  const surprise = filteredMovies.find((movie) => movie.id === surpriseId);

  return <div className="app" id="top">
    <Header favoritesCount={favorites.length} view={view} setView={(next) => { setView(next); setSurpriseId(null); }} />
    <main>
      <section className="hero"><div className="hero-left"><p className="kicker"><span className="kicker-dot" /> TU NOCHE, RESUELTA</p><h1>Hoy toca<br /><em>película.</em></h1><p className="hero-subtitle">Dinos cómo te sientes y cuánto tiempo tienes. Encontramos algo bueno para ver.</p><button className="button button-dark" onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>Encuentra tu peli <span>↓</span></button><div className="hero-note"><span>8</span><p>películas para empezar<br /><b>y ninguna decisión difícil</b></p></div></div><div className="hero-art"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-ticket"><span>ESTA NOCHE</span><b>PLAN<br />B</b><small>BUEN CINE, CERO DRAMA</small></div><span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✦</span><span className="hero-side-note">ELIGE TU ÁNIMO · 01/08</span></div></section>
      <section className="picker" id="catalogo"><div className="picker-heading"><div><p className="kicker">EL MENÚ DE HOY</p><h2>¿Qué se te antoja?</h2></div><button className="surprise-button" onClick={surpriseMe}>Sorpréndeme <span>↗</span></button></div><form className="filter-panel" aria-label="Filtros de películas" onSubmit={submitFilters}><div className="filter-group mood-group"><label htmlFor="mood">MI ÁNIMO</label><select id="mood" value={draftFilters.mood} onChange={(e) => setDraftFilters((current) => ({ ...current, mood: e.target.value }))}>{MOODS.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-group"><label htmlFor="company">¿CON QUIÉN?</label><select id="company" value={draftFilters.company} onChange={(e) => setDraftFilters((current) => ({ ...current, company: e.target.value }))}>{COMPANIONS.map((item) => <option key={item}>{item}</option>)}</select></div><div className="filter-group time-group"><label>TIEMPO DISPONIBLE</label><div className="time-options">{RUNTIMES.map((minutes) => <button type="button" key={minutes} className={draftFilters.maxMinutes === minutes ? 'time-active' : ''} aria-pressed={draftFilters.maxMinutes === minutes} onClick={() => setDraftFilters((current) => ({ ...current, maxMinutes: minutes }))}>{minutes === 150 ? 'Me da igual' : `${minutes} min`}</button>)}</div></div><label className="search-box"><span>⌕</span><input type="search" aria-label="Buscar película" placeholder="Buscar película o género" value={draftFilters.query} onChange={(e) => setDraftFilters((current) => ({ ...current, query: e.target.value }))} /><kbd>⌘ K</kbd></label><div className="filter-submit-area"><span>Elige tus opciones y presiona buscar para ver resultados.</span><div><button type="button" className="clear-button" onClick={clearFilters}>Limpiar</button><button type="submit" className="search-submit">Buscar películas <b>↗</b></button></div></div></form>
      {surprise && <div className="surprise-result"><div><span className="surprise-badge">TU PLAN B</span><h3>{surprise.title}</h3><p>{surprise.tagline} · {surprise.minutes} minutos</p></div><button onClick={() => setSelected(surprise)}>Ver por qué ↗</button></div>}
      <div className="results-heading"><div><p className="kicker">{view === 'favorites' ? 'TU COLECCIÓN' : 'LA CARTELERA'}</p><h2>{view === 'favorites' ? 'Tu lista' : 'Buenas opciones, sin hacer scroll infinito.'}</h2></div><span className="result-count">{filteredMovies.length} {filteredMovies.length === 1 ? 'película' : 'películas'}</span></div>
      {filteredMovies.length ? <div className="movie-grid">{filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} favorite={favorites.includes(movie.id)} onFavorite={toggleFavorite} onDetails={setSelected} />)}</div> : <div className="empty-state"><span>◌</span><h3>{view === 'favorites' ? 'Tu lista aún está vacía' : 'No encontramos una coincidencia'}</h3><p>{view === 'favorites' ? 'Guarda una película con el corazón y aparecerá aquí.' : 'Prueba con otro ánimo, más tiempo o una búsqueda distinta.'}</p><button className="button button-dark" onClick={clearFilters}>{view === 'favorites' ? 'Descubrir películas' : 'Limpiar filtros'}</button></div>}
      </section>
      <section className="closing-note"><span>✳</span><p>Un plan sencillo: <strong>elige algo que te guste, prepara algo rico y dale play.</strong></p><span className="closing-line" /></section>
    </main>
    <footer className="footer"><a className="wordmark" href="#top"><span className="wordmark-icon">P<span>B</span></span><span>PLAN B<small>CINE EN CASA</small></span></a><p>Un buen plan no necesita complicarse.</p><span>PELÍCULAS DE EJEMPLO · HECHO PARA PRACTICAR REACT</span></footer>
    {selected && <DetailModal movie={selected} favorite={favorites.includes(selected.id)} onFavorite={toggleFavorite} onClose={() => setSelected(null)} />}
  </div>;
}
