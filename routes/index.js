const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// a call to an endpoint that doesn't exist returns a 404 error
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;