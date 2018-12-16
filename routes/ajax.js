var express = require('express');
var router = express.Router();
const nem2Sdk = require("nem2-sdk");
const nem2lib = require("nem2-library");
const jssha3 = require('js-sha3');
const rxjs = require("rxjs");
const op = require("rxjs/operators");

const nw = nem2Sdk.NetworkType.MIJIN_TEST;
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

router.post('/privkey/sign', async function(req, res, next) {
    try {
        const keypair = nem2lib.KeyPair.createKeyPairFromPrivateKeyString(req.body.privkey);
        const signData = req.body.data;
        const signature = nem2lib.KeyPair.sign(keypair, signData);
        res.json({signature: nem2lib.convert.uint8ToHex(signature)});
    } catch (e) {
        res.json({signature: "Error"});
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

router.get('/pubkey/verify', async function(req, res, next) {
    try {
        const publicKey = nem2lib.convert.hexToUint8(req.query.pubkey);
        const data = nem2lib.convert.hexToUint8(req.query.data);
        const signature = nem2lib.convert.hexToUint8(req.query.signature);
        const isSuccess = nem2lib.KeyPair.verify(publicKey, data, signature);
        res.json({result: isSuccess ? 'success' : 'fail'});
    } catch (e) {
        res.json({result: 'Error'});
    }
});

router.get('/address/plain', async function(req, res, next) {
    try {
        res.json({
            addressPlain: nem2Sdk.Address.createFromRawAddress(req.query.address).plain()
        });
    } catch (e) {
        res.json({
            addressPlain: "Error"
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
        const address = nem2Sdk.Address.createFromRawAddress(req.query.address);
        const binAddress = nem2lib.address.stringToAddress(address.plain());
        const hexAddress = nem2lib.convert.uint8ToHex(binAddress);
        res.json({address: hexAddress});
    } catch (e) {
        res.json({address: "Error"});
    }
});

router.get('/namespace', async function(req, res, next) {
    try {
        const namespaceId = new nem2Sdk.NamespaceId(req.query.namespace);
        res.json({
            namespaceIdUInt64: JSON.stringify(namespaceId.id.toDTO()),
            namespaceIdHex: namespaceId.toHex()
        });
    } catch (e) {
        res.json({
            namespaceIdUInt64: "Error",
            namespaceIdHex: "Error"
        });
    }
});

router.get('/subnamespace', async function(req, res, next) {
    try {
        const namespaceId = new nem2Sdk.NamespaceId(req.query.parentNamespace + "." + req.query.subNamespace);
        res.json({
            namespaceIdUInt64: JSON.stringify(namespaceId.id.toDTO()),
            namespaceIdHex: namespaceId.toHex()
        });
    } catch (e) {
        res.json({
            namespaceIdUInt64: "Error",
            namespaceIdHex: "Error"
        });
    }
});

router.get('/mosaic', async function(req, res, next) {
    try {
        const mosaicId = new nem2Sdk.MosaicId(req.query.mosaic);
        res.json({
            mosaicIdUInt64: JSON.stringify(mosaicId.id.toDTO()),
            mosaicIdHex: mosaicId.toHex()
        });
    } catch (e) {
        res.json({
            mosaicIdUInt64: "Error",
            mosaicIdHex: "Error"
        });
    }
});

router.get('/transaction/hash/decode', async function(req, res, next) {
    try {
        const binary = Buffer.from(req.query.hash, 'base64');
        res.json({
            decoded: binary.toString('hex').toUpperCase(),
        });
    } catch (e) {
        res.json({
            decoded: "Error",
        });
    }
});

router.get('/transaction/type', async function(req, res, next) {
    try {
        const input = req.query.type;
        let decTypeFromDec = 0;
        let decTypeFromHex = 0;
        let decTypeFromHexRev = 0;
        const tryParseInt = parseInt(input, 10);
        if (!isNaN(tryParseInt)) {
            decTypeFromDec = tryParseInt;
        }
        try {
            const uint8arr = nem2lib.convert.hexToUint8(input);
            const buf = Buffer.from(uint8arr);
            decTypeFromHex = buf.readUIntLE(0, uint8arr.length);
            decTypeFromHexRev = buf.readUIntBE(0, uint8arr.length);
        } catch (e) {

        }
        const decType = [decTypeFromDec, decTypeFromHex, decTypeFromHexRev];
        let typeName = "unknown";
        for (let i = 0; i < 3; i++) {
            switch (decType[i]) {
                case 16724:
                    typeName = "Transfer transaction";
                    break;
                case 16718:
                    typeName = "Register namespace transaction";
                    break;
                case 16717:
                    typeName = "Mosaic definition transaction";
                    break;
                case 16973:
                    typeName = "Mosaic supply change transaction";
                    break;
                case 17229:
                    typeName = "Mosaic levy change transaction";
                    break;
                case 16725:
                    typeName = "Modify multisig account transaction";
                    break;
                case 16705:
                    typeName = "Aggregate complete transaction";
                    break;
                case 16961:
                    typeName = "Aggregate bonded transaction";
                    break;
                case 16716:
                    typeName = "Hash lock transaction";
                    break;
                case 16972:
                    typeName = "Secret lock transaction";
                    break;
                case 17228:
                    typeName = "Secret proof transaction";
                    break;
                case 16720:
                    typeName = "Account properties address modification transaction";
                    break;
                case 16721:
                    typeName = "Account properties mosaic modification transaction";
                    break;
                case 16722:
                    typeName = "Account properties entity type modification transaction";
                    break;
            }
        }
        res.json({
            name: typeName
        });
    } catch (e) {
        res.json({
            decoded: "Error",
        });
    }
});

router.get('/sha3/512', async function(req, res, next) {
    try {
        const hasher = jssha3.sha3_512.create();
        const hash = hasher.update(Buffer.from(req.query.payload, 'hex')).hex().toUpperCase();
        res.json({hash});
    } catch (e) {
        res.json({
            hash: "Error",
        });
    }
});

router.get('/sha3/256', async function(req, res, next) {
    try {
        const hasher = jssha3.sha3_256.create();
        const hash = hasher.update(Buffer.from(req.query.payload, 'hex')).hex().toUpperCase();
        res.json({hash});
    } catch (e) {
        res.json({
            hash: "Error",
        });
    }
});

router.get('/transaction/hash/payload', async function(req, res, next) {
    try {
        const payload = req.query.payload;
        const hashInputPayload =
            payload.substr(4*2,32*2) +
            payload.substr((4+64)*2,32*2) +
            payload.substr((4+64+32)*2);
        const hasher = jssha3.sha3_256.create();
        const hash = hasher.update(Buffer.from(hashInputPayload, 'hex')).hex().toUpperCase();
        res.json({hash});
    } catch (e) {
        res.json({
            hash: "Error",
        });
    }
});

router.get('/uint64/compact', async function(req, res, next) {
    try {
        const low = Number(req.query.low, 10);
        const high = Number(req.query.high, 10);
        if (isNaN(low) || isNaN(high)) {
            throw Error();
        }
        const compact = new nem2Sdk.UInt64([low, high]).compact();
        if (Number.isSafeInteger(compact)) {
            res.json({compact});
        } else {
            res.json({compact: "Too Big"});
        }
    } catch (e) {
        res.json({
            compact: "Error",
        });
    }
});

router.get('/timestamp/decode', async function(req, res, next) {
    try {
        const millis = parseInt(req.query.timestamp) + epochTimestamp;
        res.json({utcString: new Date(millis).toUTCString()});
    } catch (e) {
        res.json({
            utcString: "Error",
        });
    }
});

router.get('/message/decode', async function(req, res, next) {
    try {
        const buf = Buffer.from(req.query.payload, 'hex');
        res.json({decoded: buf.toString('utf8')});
    } catch (e) {
        res.json({
            decoded: "Error",
        });
    }
});


module.exports = router;
