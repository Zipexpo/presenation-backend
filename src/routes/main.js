// general routes
const router = require('express').Router();

router.post('/ping', function(req, res) {
    res.send('pong')
});

router.post('/echo', function (req, res) {
    const data = req.body;
    console.log('received' , data);
    res.send(data)
});

module.exports = router;
