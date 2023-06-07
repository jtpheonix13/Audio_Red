const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Set up the Spotify API client
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:3001/spotify/callback' // This should be the callback URL for the authorization flow
});

// Authorization route
router.get('/login', (req, res) => {
  // Create the authorization URL
    console.log(spotifyApi);
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-top-read']
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
    console.log(authorizeURL);
  // Redirect the user to the authorization URL
    res.redirect(authorizeURL);
});

//Callback route
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    console.log("hit");
    try {
    // Retrieve access and refresh tokens using the authorization code
    //console.log(code);
    const data = await spotifyApi.authorizationCodeGrant(code);
    //console.log(data);
    const { access_token, refresh_token } = data.body;

    // Set the access and refresh tokens on the Spotify API client
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const trending = await spotifyApi.getFeaturedPlaylists({ limit: 3 });
    const songs = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'long_term' });
    const playlists = await spotifyApi.getUserPlaylists({ limit: 3 });
    
    req.session.playlists = playlists;
    req.session.songs = songs;
    req.session.trending = trending;
    req.session.spotifyApi = spotifyApi; 
    

    // Redirect the user back to the home page
    res.redirect('http://localhost:3001/');
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
