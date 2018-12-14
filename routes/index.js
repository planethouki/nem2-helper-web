var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('account', { title: 'Account' });
});

router.get('/namespace', function(req, res, next) {
    res.render('namespace', { title: 'Namespace & Mosaic' });
});

router.get('/transaction', function(req, res, next) {
    res.render('transaction', { title: 'Transaction' });
});

router.get('/miscellaneous', function(req, res, next) {
    res.render('miscellaneous', { title: 'Miscellaneous' });
});

router.get('/network', function(req, res, next) {
    res.render('network', { title: 'Network Related' });
});

module.exports = router;
