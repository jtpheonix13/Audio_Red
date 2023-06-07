const router = require('express').Router();



router.get('/', async (req, res) => {
  try {
    console.log('hit');

    const spotifyApi = req.session.spotifyApi;
    
    const trending = req.session.trending;
    const songs = req.session.songs;
    console.log(songs.body.items[0].album.artists[0].name);
    

    res.render('home', {
      logged_in: true,
      trendingPlaylists: trending.body.playlists.items,
      topSongs: songs.body.items
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
