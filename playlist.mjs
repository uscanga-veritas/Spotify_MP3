var playListFromSpoty;
var playlistCustom = [];
// configuracion de api de Spoty
let codeVerifier = localStorage.getItem('code_verifier');
console.log(codeVerifier);

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
console.log(code);
let body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: 'http://127.0.0.1:5500/playlist.html',
  client_id: "eea4dc70e6a34340902045d6287e2b13",
  code_verifier: codeVerifier
});

async function updateToken() {
const response = fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body
})
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('access_token', data.access_token);
    getProfile()
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

  async function getProfile() {
    let accessToken = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/playlists/4QH79OK5GvD46aNbIjmDfW', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    playListFromSpoty = data
    showTable()
  } 

  updateToken()

  // F  I  N ----  D  E  configuracion de api de Spoty

  
function showTable() {

  document.getElementById('playListTitle').textContent = playListFromSpoty.name
  
  playListFromSpoty.tracks.items.forEach((cancion, index) => {
    const tr = document.createElement('tr')
    const tdImage = document.createElement('td')
    const image = document.createElement('img')
    const tdCancion = document.createElement('td')
    const tdArtis = document.createElement('td')
    const tdAlbum = document.createElement('td')
    const addButton = document.createElement('button')
    const player = document.createElement('audio')

    image.setAttribute('src', `${cancion.track.album.images[0].url}`)
    image.setAttribute('class', 'imageSize')

    tdCancion.textContent = cancion.track.name
    cancion.track.artists.forEach(artista => {
      tdArtis.textContent = artista.name
    })

    tdAlbum.textContent = cancion.track.album.name

    addButton.setAttribute('onclick', `addSong(${index})`)
    addButton.textContent = "Agregar Cancion"

    player.setAttribute('src', `${cancion.track.preview_url}`)
    player.setAttribute('controls','controls')


    tdImage.appendChild(image)

    tr.appendChild(tdImage)
    tr.appendChild(tdCancion)
    tr.appendChild(tdArtis)
    tr.appendChild(tdAlbum)
    tr.appendChild(addButton)
    tr.appendChild(player)
    

    document.getElementById('playlist-content').appendChild(tr)

  });

}

// funcion que rellenara la tabla de lista De canciones Custom
function addSong(indice) {
  const newSong = playListFromSpoty.tracks.items[indice]
  if (existSong(newSong)) {
    alert("la cancion "+ newSong.track.name + " ya existe")
  } else {
    playlistCustom.push(newSong)
    showPlaylistCustom()
  }
}

function showPlaylistCustom() {
  document.getElementById('playlist-content-custom').innerHTML = ''
  playlistCustom.forEach((cancion, index) => {

    const tr = document.createElement('tr')
    const tdCancion = document.createElement('td')
    const tdAlbum = document.createElement('td')
    const tdArtis = document.createElement('td')
    const deleteButton = document.createElement('button')

    // asign vales de mi cancion a elementos html
    tdCancion.textContent = cancion.track.name
    cancion.track.artists.forEach(artista => {
      tdArtis.textContent = artista.name
    })
    tdAlbum.textContent = cancion.track.album.name

    deleteButton.setAttribute('onclick', `deleteSong(${index})`)
    deleteButton.textContent = "Eliminar Cancion"

    tr.appendChild(tdCancion)
    tr.appendChild(tdArtis)
    tr.appendChild(tdAlbum)
    tr.appendChild(deleteButton)

    document.getElementById('playlist-content-custom').appendChild(tr)

  })
}

function deleteSong(index) {
  playlistCustom.splice(index,1)
  showPlaylistCustom()
}


function existSong(song) {
return playlistCustom.includes(song)
}