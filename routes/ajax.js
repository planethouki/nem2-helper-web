var express = require('express');
var router = express.Router();
const nem2Sdk = require("nem2-sdk");
const nem2lib = require("nem2-library");
const nw = nem2Sdk.NetworkType.MIJIN_TEST;
const rxjs = require("rxjs");
const op = require("rxjs/operators");

const host = "http://catapult48gh23s.xyz:3000";
const epochTimestamp = 1459468800000;

router.post('/privkey', async function(req, res, next) {
    try {
        const ac = nem2Sdk.Account.createFromPrivateKey(req.body.privkey, nw);
        res.json({pubkey: ac.publicKey});
    } catch (e) {
        res.json({pubkey: "Error"});
    }
});

router.get('/pubkey', async function(req, res, next) {
    try {
        const ac = nem2Sdk.PublicAccount.createFromPublicKey(req.query.pubkey, nw);
        res.json({
            addressPlain: ac.address.plain(),
            addressPretty: ac.address.pretty()
        });
    } catch (e) {
        res.json({
            addressPlain: "Error",
            addressPretty: "Error"
        });
    }
});

router.get('/address/encode', async function(req, res, next) {
    try {
        const binAddress = nem2lib.convert.hexToUint8(req.query.address);
        const rowAddress = nem2lib.address.addressToString(binAddress);
        const address = nem2Sdk.Address.createFromRawAddress(rowAddress);
        res.json({
            addressPlain: address.plain(),
            addressPretty: address.pretty()
        });
    } catch (e) {
        res.json({
            addressPlain: "Error",
            addressPretty: "Error"
        });
    }
});

router.get('/address/decode', async function(req, res, next) {
    try {
        console.log(req.query.address);
        const address = nem2Sdk.Address.createFromRawAddress(req.query.address);
        const binAddress = nem2lib.address.stringToAddress(address.plain());
        const hexAddress = nem2lib.convert.uint8ToHex(binAddress);
        res.json({address: hexAddress});
    } catch (e) {
        res.json({address: "Error"});
    }
});

module.exports = router;
