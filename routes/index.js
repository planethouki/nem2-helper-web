var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('account', { title: 'Top' });
});

router.get('/namespace', function(req, res, next) {
    res.render('namespace', { title: 'Top' });
});

module.exports = router;
