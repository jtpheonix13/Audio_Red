const router = require('express').Router();

router.get('/', (req, res) => {
    const { code } = req.query;

    res.render('setspotify', {
        code
    });

});


module.exports = router;