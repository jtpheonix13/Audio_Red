let redirect = "http://localhost:3001/home";

let client_id = "1e7220dac62c4a9b9036989092feea4d";
let client_secret = "7ca9d0bc02f242c08608171ee647ccdf";

const AUTHORIZE = "https://accounts.spotify.com/authorize";

const TOKEN = "https://accounts.spotify.com/api/token";
const ARTISTS = "https://api.spotify.com/v1/me/top/artists?time_range=long_term&offset=0&limit=10";
const TRACKS = "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&offset=0&limit=25";
const FEATURED = "https://api.spotify.com/v1/browse/featured-playlists?offset=0&limit=10";
const USERPL = "https://api.spotify.com/v1/me/playlists?offset=0&limit=10";
const USER ="https://api.spotify.com/v1/me";

const list = document.getElementById('list');
const trending = document.getElementById('trending');
const userPlist = document.getElementById('uPlaylist');
const artists = document.getElementById('artists');
const songs = document.getElementById('songs');
const profile = document.getElementById('profile');


function authorize() {
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-read-playback-state user-top-read";
    window.location.href = url;
};

function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    }
};

function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect);
};
// function to get a code for the access token
function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
};
// function to get the authorization token
function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthApi(body);
};
// function to call the api for authorization
function callAuthApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthResponse;
};
// function to get refresh the access token
function refreshAccessToken() {
    let refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthApi(body);
}; 
// function to get the access token and refresh token and store locally
function handleAuthResponse() {
    if(this.status == 200) {
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
};
// api call to get top 25 songs
function getSongs() {
    callApi("GET", TRACKS, null, handleSongResponse);
};
// function to make the api calls
function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' +localStorage.getItem("access_token"));
    xhr.send(body);
    xhr.onload = callback;
};
// function to handle api response for top 10 songs
function handleSongResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        songList(data);
    } else if (this.status == 401) {
        refreshAccessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
};
// function to handle the api response for top 25 artists
function handleArtistsResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);

        artistList(data);
    } else if (this.status == 401) {
        refreshAccessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
};
// function to add top 25 songs to the page
function songList(data) {
    removeItem();
    for (i = 0; i < data.items.length; i++) {
        const list_item = document.createElement('div');
        const list_text = document.createElement('div');
        const song = document.createElement('div');
        const artist_album = document.createElement('div');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const popu = document.createElement('div');
        const ref = document.createElement('a');
        const link = document.createTextNode('Link to Spotify');
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href= data.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        song.classList.add("song");
        artist_album.classList.add("artist-album");
        ref.classList.add("links");
        ref.setAttribute('target', 'blank');
        popu.classList.add("popu");
        img.classList.add("resize");

        let li = document.createElement('li');
        img.src = data.items[i].album.images[1].url;

        popu.innerHTML = "Popularity Rating: " + data.items[i].popularity;
        span.innerHTML = data.items[i].name;
        artist_album.innerHTML = data.items[i].album.name + " . " + data.items[i].artists[0].name;

        
        song.appendChild(span);



        list_text.appendChild(song);
        list_text.appendChild(artist_album);
        list_text.appendChild(popu);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        songs.appendChild(li);
    }
};
// function to remove items from page before new items replace them
function removeItem() {
    trending.innerHTML = '';
    userPlist.innerHTML = '';
    artists.innerHTML = '';
    songs.innerHTML = '';
};
// api call to get top ten artists
function getArtists() {
    callApi("GET", ARTISTS, null, handleArtistsResponse);
};
// function to add top ten artists to the page
function artistList(data) {
    removeItem();
    for(i = 0; i < data.items.length; i++) {
        const list_item = document.createElement('div');
        const list_text = document.createElement('div');
        const artist = document.createElement('div');
        const genres = document.createElement('div');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const popu = document.createElement('div');
        const ref = document.createElement('a');
        const link = document.createTextNode('Link to Spotify');
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href = data.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        artist.classList.add("artist");
        genres.classList.add("genre");
        ref.classList.add("links");
        ref.setAttribute('target', 'blank');
        popu.classList.add("popu");
        img.classList.add("resize");

        var li = document.createElement('li');
        img.src = data.items[i].images[1].url;

        popu.innerHTML = "Popularity Rating: " + data.items[i].popularity;
        span.innerHTML = data.items[i].name;
        for (j = 0; j < data.items[i].genres.length; j++) {
            if (j > 1) {
                break;
            } else if (j == 1) {
                genres.innerHTML = genres.innerHTML + " . " + data.items[i].genres[j];
            } else {
                genres.innerHTML = data.items[i].genres[j];
            }
        }


        artist.appendChild(span);

        list_text.appendChild(artist);
        list_text.appendChild(genres);
        list_text.appendChild(popu);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        artists.appendChild(li);
    }
};
// api call to get the featured playlists
function getFeatured() {
    callApi("GET", FEATURED, null, handleFeaturedResponse);
};
// function to handle the api call response for featured playlists
function handleFeaturedResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        featuredList(data);
    } else if (this.status == 401) {
        refreshAccessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
};
// function to add featured playlists to page
function featuredList(data) {
    removeItem();
    for (i = 0; i < data.playlists.items.length; i++) {
        const list_item = document.createElement('div');
        const list_text = document.createElement('div');
        const playlist_name = document.createElement('div');
        const description = document.createElement('div');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const ref = document.createElement('a');
        const link = document.createTextNode('Link to Spotify');
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href= data.playlists.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        playlist_name.classList.add("playlist-name");
        description.classList.add("description");
        ref.classList.add("links");
        ref.setAttribute('target', 'blank');
        img.classList.add("resize");

        let li = document.createElement('li');
        img.src = data.playlists.items[i].images[0].url;

        span.innerHTML = data.playlists.items[i].name;
        description.innerHTML = data.playlists.items[i].description;

        
        playlist_name.appendChild(span);



        list_text.appendChild(playlist_name);
        list_text.appendChild(description);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        trending.appendChild(li);
    }
};
// api call to get the user playlist
function getUserPlaylist() {
    callApi("GET", USERPL, null, handleUserPlResponse);
};
// function to handle api call response for user playlists
function handleUserPlResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        UserPList(data);
    } else if (this.status == 401) {
        refreshAccessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
};
// function to add user playlists to the page
function UserPList(data) {
    removeItem();
    for (i = 0; i < data.items.length; i++) {
        const list_item = document.createElement('div');
        const list_text = document.createElement('div');
        const name = document.createElement('div');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const ref = document.createElement('a');
        const link = document.createTextNode('Link to Spotify');
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href= data.items[i].external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        name.classList.add("song");
        ref.classList.add("links");
        ref.setAttribute('target', 'blank');
        img.classList.add("resize");

        let li = document.createElement('li');
        img.src = data.items[i].images[0].url;

        
        span.innerHTML = data.items[i].name;

        
        name.appendChild(span);



        list_text.appendChild(name);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        userPlist.appendChild(li);
    }
};

// Api call to get the user profile
function getUserProfile() {
    callApi("GET", USER, null, handleUserResponse);
};
// function to handle the response from the api call and log to console
function handleUserResponse() {
    if (this.status == 200) {
        let data = JSON.parse(this.responseText);
        console.log(data);
        userProfile(data);
    } else if (this.status == 401) {
        refreshAccessToken();
    } else {
        console.log(this.responseText);
        alert(this.responseText);
    }
};

// function to add user profile info to the page
function userProfile(data) {
    removeItem();
        const list_item = document.createElement('div');
        const list_text = document.createElement('div');
        const display_name = document.createElement('div');
        const img = document.createElement('img');
        const ref = document.createElement('a');
        const link = document.createTextNode('Link to Spotify');
        ref.appendChild(link);
        ref.title = "Link to Spotify";
        ref.href= data.external_urls.spotify;

        list_item.classList.add("list-item");
        list_text.classList.add("list-text");
        display_name.classList.add("artist-album");
        ref.classList.add("links");
        ref.setAttribute('target', 'blank');
        img.classList.add("resize");

        let li = document.createElement('li');
        img.src = data.images[0].url;
        display_name.innerHTML = data.display_name;

        list_text.appendChild(display_name);
        list_text.appendChild(ref);
        list_item.appendChild(list_text);
        list_item.appendChild(img);
        li.appendChild(list_item);

        profile.appendChild(li);
    
};