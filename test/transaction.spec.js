const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const chai = require('chai');


describe('transaction', function() {

    const sha3_256 = JSON.parse(fs.readFileSync("test/test-vectors/0.test-sha3-256.json"));
    const transactionTypeName = JSON.parse(fs.readFileSync("test/test-vectors/i.test-transaction-type-name.json"));

    for (let i = 0; i < sha3_256.length / 100; i++) {
        it(`GET /sha3/256 part:${i}`, function (done) {
            const req = sha3_256.slice(i * 100, (i + 1) * 100).map(tv => {
                return request(app)
                    .get('/ajax/sha3/256')
                    .query({payload: tv.data})
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect({hash: tv.sha3});
            });
            Promise.all(req).then(result => {
                done();
            });
        });
    }

    it('GET /sha3/512', function (done) {
        request(app)
            .get('/ajax/sha3/512')
            .query({payload: '48656C6C6F204E656D3221'})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({hash: '5AD8280EF8ED2D37037D0540FDDE6942DF5C44D3046A8C90E72C23751D5B71A01A262FDAFA853724644799E6EA44787384F5B6EFF6FB19B742CBF9EBFB78E367'})
            .then(() => {
                done();
            });
    });

    it('GET /transaction/hash/decode', function (done) {
        request(app)
            .get('/ajax/transaction/hash/decode')
            .query({hash: 'PC6RI4lWCWobmSAQ1l5k6vVlTI8YpmOPTgmoSaYpCQE='})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({decoded: '3C2E91238956096A1B992010D65E64EAF5654C8F18A6638F4E09A849A6290901'})
            .then(() => {
                done();
            });
    });

    it('GET /transaction/hash/payload', function (done) {
        request(app)
            .get('/ajax/transaction/hash/payload')
            .query({payload: 'CA0000005FBA8E69C35084EB80CC5A2BAF484EC559638F9A73A256ED63198FF1E0034B40CF05A38D61D1F548F9E35E4CA338F2E11FCEEBAEB38650476CD55593CE858B035D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C0390415200000000000000005F1EB1E51300000029CF5FD941AD25D540420F00000000003C0000000000000003F3E167CCBABF33D64806CCF2544C4740FE75A2957847D6F7BDF19316DE63478390758EB47C28D6143BAA3DE6A8D9C319B503A1BFD8E789E9E2'})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({hash: '903EEA93F1D1F1C4B8955A5DC1AD42B1DC40FDE6927034E7CCD811D796F867D3'})
            .then(() => {
                done();
            });
    });

    it('GET /transaction/type', function(done) {
        const reqDec = transactionTypeName.map(tv => {
            return request(app)
                .get('/ajax/transaction/type')
                .query({type: tv.typeDec})
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({name: tv.name});
        });
        const reqHexLE = transactionTypeName.map(tv => {
            return request(app)
                .get('/ajax/transaction/type')
                .query({type: tv.typeHexLE})
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({name: tv.name});
        });
        const reqHexBE = transactionTypeName.map(tv => {
            return request(app)
                .get('/ajax/transaction/type')
                .query({type: tv.typeHexBE})
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({name: tv.name});
        });
        Promise.all(reqDec.concat(reqHexLE).concat(reqHexBE)).then(result => {
            done();
        });
    });

});