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
    
    console.log(playlists.body.items);

    res.render('profile', {
      ...userData,
      playlists: playlists.body.items,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
