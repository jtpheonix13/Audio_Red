const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Set up the Spotify API client
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI // This should be the callback URL for the authorization flow
});

module.exports = router;


