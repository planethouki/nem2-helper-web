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

const endpoints = {
    "planet": "http://catapult48gh23s.xyz:3000",
    "44uk": "http://catapult-test.44uk.net:3000",
    "daoka": "http://catapult-test.daoka.ml:3000",
    "soralis": "http://catapult-test.soralis.org:3000"
};

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

router.get('/address/balance', async function(req, res, next) {
    try {
        const address = nem2Sdk.Address.createFromRawAddress(req.query.address);
        const endpoint = endpoints[req.query.endpoint];

        const accountHttp = new nem2Sdk.AccountHttp(endpoint);
        const mosaicHttp = new nem2Sdk.MosaicHttp(endpoint);
        const nameSpaceHttp = new nem2Sdk.NamespaceHttp(endpoint);
        const mosaicService = new nem2Sdk.MosaicService(accountHttp, mosaicHttp, nameSpaceHttp);
        const mosaics = await new Promise((resolve, reject) => {
            const ownedMosaics = [];
            accountHttp.getAccountInfo(address).pipe(
                op.mergeMap(accountInfo => {
                    const mosaicsWithZeroXEM = accountInfo.mosaics.length !== 0 ? accountInfo.mosaics : [nem2Sdk.XEM.createAbsolute(0)];
                    return mosaicService.mosaicsAmountView(mosaicsWithZeroXEM);
                }),
                op.flatMap((_) => _),
            ).subscribe(
                function(mosaicAmountView) {
                    const divisibility = mosaicAmountView.mosaicInfo.properties.divisibility;
                    const amount = mosaicAmountView.amount.compact();
                    let relAmount = amount / (10 ** divisibility);
                    const mosaicData = mosaicAmountView.namespaceName +
                        ":" +
                        mosaicAmountView.mosaicName +
                        "::" +
                        amount.toString(10) +
                        " (" +
                        relAmount.toString(10) +
                        ") ";
                    ownedMosaics.push(mosaicData);
                },
                function() {
                    resolve([]);
                },
                function() {
                    resolve(ownedMosaics);
                }
            );
        });
        res.json({mosaics});

    } catch (e) {
        res.json({
            mosaics: "Error"
        });
    }
});


router.get('/address/namespaces', async function(req, res, next) {
    try {
        const address = nem2Sdk.Address.createFromRawAddress(req.query.address);
        const endpoint = endpoints[req.query.endpoint];

        const nameSpaceHttp = new nem2Sdk.NamespaceHttp(endpoint);
        const namespaces = await new Promise((resolve, reject) => {
            nameSpaceHttp.getNamespacesFromAccount(address).pipe(
                op.mergeMap(namespaceInfoArr => {
                    // console.log(namespaceInfoArr);
                    if (namespaceInfoArr.length === 0) {
                        return rxjs.throwError(new Error());
                    }
                    return namespaceInfoArr.map(nif => nif.id).map(nsId => nameSpaceHttp.getNamespacesName([nsId]));
                }),
                op.combineAll()
            ).subscribe(namespaceNames => {
                // console.log(namespaceNames);
                const data = namespaceNames.map(nsLevel => nsLevel.map(n => n.name).reverse().join("."));
                resolve(data);
            }, error => {
                resolve([]);
            });
        });
        res.json({namespaces});

    } catch (e) {
        console.error(e);
        res.json({
            namespaces: "Error"
        });
    }
});

router.get('/namespace/mosaics', async function(req, res, next) {
    try {
        const namespaceId = new nem2Sdk.NamespaceId(req.query.namespace);
        const endpoint = endpoints[req.query.endpoint];

        const accountHttp = new nem2Sdk.AccountHttp(endpoint);
        const mosaicHttp = new nem2Sdk.MosaicHttp(endpoint);
        const nameSpaceHttp = new nem2Sdk.NamespaceHttp(endpoint);
        const mosaicService = new nem2Sdk.MosaicService(accountHttp, mosaicHttp, nameSpaceHttp);
        const mosaics = await new Promise((resolve, reject) => {
            mosaicHttp.getMosaicsFromNamespace(namespaceId).pipe(
                op.mergeMap(mosaicInfoArr => {
                    // console.log(mosaicInfoArr);
                    if (mosaicInfoArr.length === 0) {
                        return rxjs.throwError(new Error());
                    }
                    return mosaicService.mosaicsView(mosaicInfoArr.map(mif => mif.mosaicId));
                }),
            ).subscribe(mosaisViews => {
                // console.log(mosaisViews);
                const data = mosaisViews.map(mv => mv.fullName());
                resolve(data);
            }, error => {
                resolve([]);
            });
        });
        res.json({mosaics});
    } catch (e) {
        console.error(e);
        res.json({
            mosaics: "Error"
        });
    }
});

router.get('/address/multisig/graph', async function(req, res, next) {
    try {
        const address = nem2Sdk.Address.createFromRawAddress(req.query.address);
        const endpoint = endpoints[req.query.endpoint];
        const accountHttp = new nem2Sdk.AccountHttp(endpoint);

        const graph = await new Promise((resolve, reject) => {
            const graphData = [];
            accountHttp.getMultisigAccountGraphInfo(address).subscribe(multisigAccountGraphInfo => {
                console.log(multisigAccountGraphInfo);
                multisigAccountGraphInfo.multisigAccounts.forEach((value, key, map) => {
                    console.log(value);
                    if (key === 0) {
                        value.map(multisigAccountInfo => {
                            graphData.push([
                                {v:multisigAccountInfo.account.publicKey.concat("-0"), f:multisigAccountInfo.account.publicKey},
                                '',
                                multisigAccountInfo.account.address.pretty(),
                            ]);
                            multisigAccountInfo.cosignatories.map(publicAccount => {
                                graphData.push([
                                    {v:publicAccount.publicKey.concat("-1"), f:publicAccount.publicKey},
                                    multisigAccountInfo.account.publicKey.concat("-0"),
                                    publicAccount.address.pretty(),
                                ]);
                            });
                        });
                    } else {
                        value.map(multisigAccountInfo => {
                            multisigAccountInfo.cosignatories.map(publicAccount => {
                                graphData.push([
                                    {v:publicAccount.publicKey.concat(`-${key-1}`), f:publicAccount.publicKey},
                                    multisigAccountInfo.account.publicKey.concat(`-${key}`),
                                    publicAccount.address.pretty(),
                                ]);
                            });
                        });
                    }
                });
                // console.log(graph);
                resolve(graphData);
            });
        });
        res.json({graph});

    } catch (e) {
        res.json({
            graph: "Error"
        });
    }
});

module.exports = router;
