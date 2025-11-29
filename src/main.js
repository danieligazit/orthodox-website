import './style.css'
import albumsData from './data/albums.json'

// Render a single album/release module
function renderAlbum(album) {
  return `
    <article class="release-module">
      <div class="meta-line">
        <span>CAT: ${album.catalog}</span>
        <span>${album.code}</span>
      </div>

      <div class="image-frame">
        <img src="${album.imageUrl}" alt="Cover Art">
      </div>

      <div class="info-block">
        <h2 class="artist">${album.artist}</h2>
        
        <div class="track-details">
          <span class="release-title">${album.title}</span>
        </div>
      </div>
    </article>
  `
}

// Render all albums
function renderAlbums(albums) {
  const container = document.getElementById('albums-container')
  if (!container) {
    console.error('Albums container not found')
    return
  }

  container.innerHTML = albums.map(album => renderAlbum(album)).join('')
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderAlbums(albumsData)
})

