mapboxgl.accessToken = 'pk.eyJ1Ijoic3VidXJiLWNsb3VkIiwiYSI6ImNtOWpwbGZsMjBlOGYya3NnZ3RxNzBqcTIifQ.FBfnIbs74CMOZqL3wXdfFw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/suburb-cloud/cme687nep016y01qs0pake07h',
  center: [4.3517, 50.8503],
  zoom: 11
});

// Artist data
const artists = [
  {
    name: '$ICA',
    coords: [4.3254, 50.8861],
    city: 'Brussels',
    description: 'Energetic club sounds. She likes to keep you on your toes going from one genre and tempo to another.',
    link: 'https://www.youtube.com/watch?v=Pd_yWblJTGM',
    cardImg: 'assets/$ICA_CARD.png',
    genres: ['Jersey Club', 'UK Garage', 'Pop']
  },
  {
    name: 'TEHBBI',
    coords: [4.4837, 51.0078],
    city: 'Mechelen',
    description: 'Multidisciplinary artist. Exploring sound, visuals, and rhythms through instinct.',
    link: 'https://youtu.be/1V4mP_bwozI?si=zVfjvC5wu67r8-6_',
    cardImg: 'assets/TEHBBI_CARD.png',
    genres: ['Batida', 'Breakbeat', 'Gqom']
  },
  {
    name: 'nati',
    coords: [4.3801277, 50.8982801],
    city: 'Brussels',
    description: 'Nati is an artist with a sound that breaks boundaries and thrives on unpredictability.',
    link: '', // BRUZZ MIX UPLOAD !//
    cardImg: 'assets/NATI_CARD.png',
    genres: ['Jungle', 'UK Garage', 'Hard Groove']
  },
  {
    name: 'cjane',
    coords: [3.7277678, 51.0570489],
    city: 'Ghent',
    description: 'Shaped by curiosity, instinct, and an openness to constant change. Carving space in a scene still finding balance.',
    link: 'https://youtu.be/Y_f8WfS6130?si=o6MHI9CccRs7H9Yn',
    cardImg: 'assets/CJANE_CARD.png',
    genres: ['Hard Groove', 'Bounce', 'X']
  },
    {
    name: 'RAIK',
    coords: [5.5689008, 50.6412566],
    city: 'Liège',
    description: 'Bringing tekno to life carving out his own path, where sound and visual experimentation intertwine into one cohesive vision.',
    link: 'https://youtu.be/BR44ckWGg0c?si=muSG6A_lUPF-Ch2z',
    cardImg: 'assets/RAIK_CARD.png',
    genres: ['Tekno', 'X', 'X']
  }
];

let currentMarkers = [];

function getAllGenres(data) {
  const genreSet = new Set();
  data.forEach(artist => artist.genres?.forEach(g => genreSet.add(g)));
  return [...genreSet].sort();
}

function renderGenreFilters(genres) {
  const container = document.getElementById("genre-filters");
  container.innerHTML = "";

  genres.forEach(genre => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${genre}" />
      ${genre}
    `;
    container.appendChild(label);
  });
}

function addMarker(artist) {
  const popupContent = `
    <div class="popup-card" style="background-image: url(${artist.cardImg});">
      <div class="popup-overlay">
        <h3>${artist.name}</h3>
        <p><em>${artist.city}</em></p>
        <p>${artist.description}</p>
        <div class="genres">${artist.genres.map(g => `<span>${g}</span>`).join('')}</div>
        <p><a href="${artist.link}" target="_blank">Watch set</a></p>
      </div>
    </div>
  `;

  const popup = new mapboxgl.Popup({ offset: [0, -500] }).setHTML(popupContent);

const el = document.createElement('div');
el.className = 'custom-marker';
el.style.backgroundImage = 'url(assets/MAP_MARKER_2.png)';

  const marker = new mapboxgl.Marker(el)
    .setLngLat(artist.coords)
    .setPopup(popup)
    .addTo(map);

  currentMarkers.push(marker);
}

function filterArtists() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const selectedGenres = Array.from(document.querySelectorAll('#genre-filters input:checked'))
    .map(cb => cb.value);

  // Remove old markers
  currentMarkers.forEach(marker => marker.remove());
  currentMarkers = [];

  artists.forEach(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchValue);
    const matchesGenres =
      selectedGenres.length === 0 || artist.genres.some(g => selectedGenres.includes(g));

    if (matchesSearch && matchesGenres) {
      addMarker(artist);
    }
  });
  
}

document.getElementById('searchInput').addEventListener('input', filterArtists);
document.getElementById('genre-filters').addEventListener('change', filterArtists);

const genres = getAllGenres(artists);
renderGenreFilters(genres);
filterArtists();

// Marker zoom scaling
map.on('zoom', () => {
  const zoom = map.getZoom();
  const scale = zoom / 4;

  document.querySelectorAll('.custom-marker').forEach(marker => {
    marker.style.width = `${25 * scale}px`;
    marker.style.height = `${25 * scale}px`;
    marker.style.backgroundSize = 'cover';
  });
});
