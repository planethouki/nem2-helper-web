var express = require('express');
var router = express.Router();
const nem2Sdk = require("nem2-sdk");
const BlockchainHttp = nem2Sdk.BlockchainHttp,
    QueryParams = nem2Sdk.QueryParams,
    UInt64 = nem2Sdk.UInt64;
const rxjs = require("rxjs");
const op = require("rxjs/operators");

const host = "http://catapult48gh23s.xyz:3000";
const epochTimestamp = 1459468800000;


router.get('/chain/height', async function(req, res, next) {
    const blockchainHttp = new BlockchainHttp(host);
    const height = await blockchainHttp.getBlockchainHeight().toPromise();
    res.json({"height": height.compact()});
});

router.get('/block', async function(req, res, next) {
    const height = req.query.height;
    const blockchainHttp = new BlockchainHttp(host);
    blockchainHttp.getBlockByHeight(height).subscribe(
        (blockInfo) => {
            const data = {
                "height": blockInfo.height.compact(),
                "timestamp": new Date(blockInfo.timestamp.compact() + epochTimestamp),
                "harvester": blockInfo.signer.address.pretty(),
                "txes": blockInfo.numTransactions,
                "fees": blockInfo.totalFee.compact(),
            };
            res.json(data);
        },
        (error) => {
            console.error(error);
        }
    );

});

router.get('/blocks', async function(req, res, next) {
    const size = req.query.size;
    const page = req.query.page;
    const blockchainHttp = new BlockchainHttp(host);
    const height = await blockchainHttp.getBlockchainHeight().toPromise();
    const targetHeight = height.compact() - (size * (page - 1));
    const last_page = Math.ceil(height.compact() / size);
    blockchainHttp.getBlocksByHeightWithLimit(targetHeight, size).pipe(

    ).subscribe((blockInfos) => {
        const data = blockInfos.map((blockInfo) => {
            return {
                "height": blockInfo.height.compact(),
                "timestamp": new Date(blockInfo.timestamp.compact() + epochTimestamp),
                "harvester": blockInfo.signer.address.pretty(),
                "txes": blockInfo.numTransactions,
                "fees": blockInfo.totalFee.compact(),
            };
        });
        res.json({
            last_page,
            data
        });
    });
});

router.get('/txs', async function(req, res, next) {
    const blockchainHttp = new BlockchainHttp(host);

    const chainHeight = await blockchainHttp.getBlockchainHeight().toPromise().then(x => Promise.resolve(x.compact()));
    const numberOfFetchBlock = 100;

    const txArray = [];
    for (let i = 0; i < numberOfFetchBlock; i++) {
        const height = chainHeight - i;
        const param = new QueryParams(100);
        const txArrayResult = await blockchainHttp.getBlockTransactions(height, param).toPromise();
        txArrayResult.map(x => {
            let hash = x.transactionInfo.hash;
            let height = x.transactionInfo.height.compact().toString();
            let signer = x.signer.address.plain();
            let recipient = "";
            let type = x.type.toString();
            let amount = "";
            let fee = x.fee.compact().toString();
            let deadline = new Date(new UInt64(x.deadline.toDTO()).compact() + epochTimestamp);
            // switch (x.type) {
            //     case 16724:
            //         break;
            //     default:
            //
            // }
            txArray.push({hash, height, signer, recipient, type, amount, fee, deadline});
        });

        if (txArrayResult.length >= 100) {
            break;
        }
    }
    res.json(txArray);
});


router.get('/stat/storage', async function(req, res, next) {
    const blockchainHttp = new BlockchainHttp(host);
    blockchainHttp.getDiagnosticStorage().subscribe(x => {
        console.log(x);
        res.json(x);
    });
});
router.get('/stat/blocks', async function(req, res, next) {
    const blockchainHttp = new BlockchainHttp(host);
    blockchainHttp.getBlockchainHeight().pipe(
        op.flatMap(chainHeight => {
            return rxjs.forkJoin(
                blockchainHttp.getBlocksByHeightWithLimit(chainHeight.compact(), 100),
                blockchainHttp.getBlocksByHeightWithLimit(chainHeight.compact() - 100, 100),
                blockchainHttp.getBlocksByHeightWithLimit(chainHeight.compact() - 200, 100),
            )
        }),
    ).subscribe(blockInfoArrayArray => {
        res.json(
            blockInfoArrayArray.reduce((acc, cur) => {
                return acc.concat(cur)
            }).map(blockInfo => {
                return {
                    height: blockInfo.height.compact(),
                    timestamp: blockInfo.timestamp.compact() + epochTimestamp,
                    numTransactions: blockInfo.numTransactions,
                }
            })
        );
    });
});

module.exports = router;
