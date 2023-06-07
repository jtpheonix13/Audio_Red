const router = require('express').Router();
const { User } = require('../../../models');

// Use withAuth middleware to prevent access to route
router.get('/', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      raw: true,
      nest: true,
    });

    const spotifyApi = req.session.spotifyApi;
    
    const playlists = req.session.playlists;
    const artists = req.session.artists;
    const newRelease = req.session.newRelease;
    
    console.log(newRelease.body.albums.items);

    res.render('profile', {
      ...userData,
      playlists: playlists.body.items,
      artists: artists.body.items,
      newRelease: newRelease.body.albums.items,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
