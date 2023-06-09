

// Set up the Spotify API client
const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const { generateRandomString } = require('../../utils/helpers');

// Set up the Spotify API client
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: "https://lit-shelf-80408.herokuapp.com/home/callback" // This should be the callback URL for the authorization flow
});

// Authorization route
router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  req.session.state = state;
  // Create the authorization URL
  // console.log(spotifyApi);
  const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-top-read']
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  //console.log(authorizeURL);
  
  // Redirect the user to the authorization URL
    res.redirect(authorizeURL);
});



module.exports = router;
