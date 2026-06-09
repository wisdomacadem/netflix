const movies = [
  { id:1,title:"Midnight Protocol",genre:"Thriller",year:2026,rating:9.1,desc:"A cybersecurity analyst discovers a global conspiracy hidden inside a streaming platform.",gradient:"linear-gradient(145deg,#111827,#e50914)"},
  { id:2,title:"Neon Dynasty",genre:"Sci‑Fi",year:2025,rating:8.8,desc:"In a future mega-city, a courier carries the code that can free millions from digital control.",gradient:"linear-gradient(145deg,#240046,#00b4d8)"},
  { id:3,title:"Last Kingdom Road",genre:"Action",year:2024,rating:8.3,desc:"A former driver becomes the only hope for a family hunted across the desert.",gradient:"linear-gradient(145deg,#3a0ca3,#f72585)"},
  { id:4,title:"The Quiet Apostle",genre:"Drama",year:2026,rating:9.4,desc:"A historical drama about courage, betrayal, faith, and a message that changes an empire.",gradient:"linear-gradient(145deg,#1f2937,#d97706)"},
  { id:5,title:"Market Open",genre:"Documentary",year:2025,rating:8.7,desc:"Inside the minds of traders during the most volatile opening bell of the decade.",gradient:"linear-gradient(145deg,#064e3b,#22c55e)"},
  { id:6,title:"Red Zone",genre:"Action",year:2023,rating:8.1,desc:"A rescue team has 90 minutes to cross a locked-down city before sunrise.",gradient:"linear-gradient(145deg,#450a0a,#ef4444)"},
  { id:7,title:"Golden Signal",genre:"Mystery",year:2026,rating:8.9,desc:"A detective follows strange signals that appear before every major crime.",gradient:"linear-gradient(145deg,#713f12,#facc15)"},
  { id:8,title:"After Eden",genre:"Sci‑Fi",year:2024,rating:8.5,desc:"Humanity rebuilds civilization on a planet that remembers every human mistake.",gradient:"linear-gradient(145deg,#052e16,#14b8a6)"},
  { id:9,title:"Empire of Glass",genre:"Drama",year:2025,rating:8.6,desc:"A billionaire family fights for control of a company built on secrets.",gradient:"linear-gradient(145deg,#0f172a,#64748b)"},
  { id:10,title:"Comedy Club 404",genre:"Comedy",year:2026,rating:7.9,desc:"A failed developer accidentally builds the world's funniest broken app.",gradient:"linear-gradient(145deg,#581c87,#fb7185)"}
];

const movieGrid = document.getElementById('movieGrid');
const watchlistGrid = document.getElementById('watchlistGrid');
const genreFilter = document.getElementById('genreFilter');
const searchInput = document.getElementById('searchInput');
const watchlistCount = document.getElementById('watchlistCount');
const movieCount = document.getElementById('movieCount');
const featuredCard = document.getElementById('featuredCard');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');
let watchlist = JSON.parse(localStorage.getItem('streamvault-watchlist')) || [];

function saveWatchlist(){ localStorage.setItem('streamvault-watchlist', JSON.stringify(watchlist)); }
function isSaved(id){ return watchlist.includes(id); }
function toggleWatchlist(id){
  watchlist = isSaved(id) ? watchlist.filter(movieId => movieId !== id) : [...watchlist, id];
  saveWatchlist(); renderAll();
}
function cardTemplate(movie){
  return `<article class="movie-card" onclick="openModal(${movie.id})">
    <div class="poster" style="background:${movie.gradient}"><h3>${movie.title}</h3></div>
    <div class="movie-body">
      <div class="movie-meta"><span>${movie.genre}</span><span>⭐ ${movie.rating}</span></div>
      <p>${movie.desc}</p>
      <div class="card-actions">
        <button class="mini-btn" onclick="event.stopPropagation(); openModal(${movie.id})">Details</button>
        <button class="mini-btn ${isSaved(movie.id) ? 'saved' : ''}" onclick="event.stopPropagation(); toggleWatchlist(${movie.id})">${isSaved(movie.id) ? 'Saved' : '+ Save'}</button>
      </div>
    </div>
  </article>`;
}
function renderMovies(){
  const search = searchInput.value.toLowerCase();
  const genre = genreFilter.value;
  const filtered = movies.filter(m => (genre === 'all' || m.genre === genre) && (m.title.toLowerCase().includes(search) || m.desc.toLowerCase().includes(search)));
  movieGrid.innerHTML = filtered.length ? filtered.map(cardTemplate).join('') : `<div class="empty">No movies found.</div>`;
}
function renderWatchlist(){
  const savedMovies = movies.filter(m => watchlist.includes(m.id));
  watchlistGrid.innerHTML = savedMovies.length ? savedMovies.map(cardTemplate).join('') : `<div class="empty">Your watchlist is empty. Save a movie to see it here.</div>`;
  watchlistCount.textContent = savedMovies.length;
}
function renderGenres(){
  const genres = [...new Set(movies.map(m => m.genre))];
  genreFilter.innerHTML = `<option value="all">All Genres</option>` + genres.map(g => `<option value="${g}">${g}</option>`).join('');
}
function renderFeatured(){
  const top = [...movies].sort((a,b)=>b.rating-a.rating)[0];
  featuredCard.innerHTML = `<div class="poster-large" style="background:${top.gradient}"><h3>${top.title}</h3></div><div class="featured-info"><span class="badge">⭐ ${top.rating} Featured</span><p>${top.desc}</p><button class="primary-btn" onclick="openModal(${top.id})">Watch Preview</button></div>`;
}
function openModal(id){
  const m = movies.find(movie => movie.id === id);
  modalContent.innerHTML = `<div class="modal-hero" style="background:${m.gradient}"><div><span class="badge">${m.genre} • ${m.year} • ⭐ ${m.rating}</span><h2>${m.title}</h2></div></div><div class="modal-info"><p>${m.desc}</p><p><strong>Recruiter skills shown:</strong> dynamic UI rendering, event handling, filtering, state management, localStorage, responsive design, and reusable JavaScript functions.</p><button class="primary-btn" onclick="toggleWatchlist(${m.id})">${isSaved(m.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}</button></div>`;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeMovieModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
function renderAll(){ movieCount.textContent = movies.length; renderMovies(); renderWatchlist(); renderFeatured(); }

searchInput.addEventListener('input', renderMovies);
genreFilter.addEventListener('change', renderMovies);
closeModal.addEventListener('click', closeMovieModal);
modal.addEventListener('click', e => { if(e.target.classList.contains('modal-backdrop')) closeMovieModal(); });
document.getElementById('clearWatchlist').addEventListener('click',()=>{ watchlist=[]; saveWatchlist(); renderAll(); });
document.getElementById('themeBtn').addEventListener('click',()=> document.body.classList.toggle('light'));
document.getElementById('randomPick').addEventListener('click',()=> openModal(movies[Math.floor(Math.random()*movies.length)].id));

renderGenres();
renderAll();
