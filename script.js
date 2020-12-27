const form = document.getElementById("form");
const search = document.getElementById("search");
const results = document.getElementById("results");
const more = document.getElementById("more");

//api
const apiUrl = "https://api.lyrics.ovh";

//search song by name or by an artist
async function searchSongs(term) {
  //   fetch(`${apiUrl}/suggest/${term}`)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));

  const res = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await res.json();
  showData(data);
}

//Show data and artist in the dom
function showData(data) {
  //   let output = "";
  //   data.data.forEach((song) => {
  //     output += `
  //       <li>
  //         <span><b>${song.artist.name}</b> - ${song.title}</span>
  //         <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
  //       </li>
  //       `;
  //   });

  //   results.innerHTML = `<ul class="songs">${output}</ul>`;

  results.innerHTML = `<ul class="songs">${data.data
    .map(
      (song) => `<li>
        <span><b>${song.artist.name}</b> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>`
    )
    .join("")}</ul> `;

  if (data.prev || data.next) {
    more.innerHTML = `${
      data.prev
        ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>`
        : ""
    } ${
      data.next
        ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>`
        : ""
    }`;
  } else {
    more.innerHTML = "";
  }
}

//get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showData(data);
}

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  results.innerHTML = `<h2><b>${artist}</b> - ${songTitle}</h2> <span>${lyrics}</span>`;

  more.innerHTML = "";
}

//event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();
  if (!searchTerm) {
    alert("Please type something in the search box");
  } else {
    searchSongs(searchTerm);
  }
});

//Get lyrics button click
results.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});
