const router = require('express').Router();
const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI // This should be the callback URL for the authorization flow
});


router.get('/callback', async (req, res) => {
  const { code } = req.query;
  console.log(code);
  console.log("hit");
  try {
  // Retrieve access and refresh tokens using the authorization code
  console.log(code);
  const data = await spotifyApi.authorizationCodeGrant(code);
  console.log(data);
  const { access_token, refresh_token } = data.body;

  // Set the access and refresh tokens on the Spotify API client
  spotifyApi.setAccessToken(access_token);
  spotifyApi.setRefreshToken(refresh_token);

  // const trending = await spotifyApi.getFeaturedPlaylists({ limit: 5 });
  // const songs = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'long_term' });
  // const playlists = await spotifyApi.getUserPlaylists({ limit: 3, time_range: 'long_term' });
  // const artists = await spotifyApi.getMyTopArtists({ limit: 5, time_range: 'long_term'});
  // const newRelease = await spotifyApi.getNewReleases({ limit : 3, offset: 0, country: 'SE' });
  
  // req.session.newRelease = newRelease;
  // req.session.artists = artists;
  // req.session.playlists = playlists;
  // req.session.songs = songs;
  // req.session.trending = trending;
  req.session.spotifyApi = spotifyApi; 
  
  // console.log(req.session.spotifyApi);

  // Redirect the user back to the home page
  res.redirect('/home');
  } catch (error) {
      res.status(500).json(error);
      console.log(error);
  }
});

router.get('/', async (req, res) => {
  try {

    const spotifyApi = req.session.spotifyApi;
    if (!spotifyApi) {
      res.render('home', {
        logged_in: true,
        spotify_api_set: false
      })
      return;
    }
    
    
    const trending = req.session.trending;
    const songs = req.session.songs;
    console.log(trending.body.playlists.items[0].description);

  
    res.render('home', {
      logged_in: true,
      trendingPlaylists: trending.body.playlists.items,
      topSongs: songs.body.items,
      spotify_api_set: true
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});




module.exports = router;
