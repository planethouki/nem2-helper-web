const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const chai = require('chai');


describe('account', function() {

    const signPrivate = JSON.parse(fs.readFileSync("test/test-vectors/2.test-sign-private.json"));
    const keysPrivate = JSON.parse(fs.readFileSync("test/test-vectors/1.test-keys-private-generated.json"));

    it('POST /privkey', function(done) {
        const req = keysPrivate.map(tv => {
            return request(app)
                .post('/ajax/privkey')
                .send({privkey: tv.privateKey})
                .expect(200)
                .expect('Content-Type', /json/)
                .expect({pubkey: tv.publicKey});
        });
        Promise.all(req).then(result => {
            done();
        });
    });

    for (let i = 0; i < signPrivate.length / 100; i++) {
        it(`POST /privkey/sign part:${i}`, function(done) {
            const req = signPrivate.slice(i*100,(i+1)*100).map(tv => {
                return request(app)
                    .post('/ajax/privkey/sign')
                    .send({privkey: tv.privateKey, data: tv.data})
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect({signature: tv.signature});
            });
            Promise.all(req).then(result => {
                done();
            });
        });
    }

    it('GET /pubkey', function(done) {
        const req = keysPrivate.map(tv => {
            const addressPlain = tv.address;
            return request(app)
                .get('/ajax/pubkey')
                .query({ pubkey: tv.publicKey })
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                    chai.expect(res.body).to.include({addressPlain})
                });
        });
        Promise.all(req).then(result => {
            done();
        });
    });

    for (let i = 0; i < signPrivate.length / 100; i++) {
        it(`GET /pubkey/verify part:${i}`, function (done) {
            const req = signPrivate.slice(i*100,(i+1)*100).map(tv => {
                return request(app)
                    .get('/ajax/pubkey/verify')
                    .query({pubkey: tv.publicKey, data: tv.data, signature: tv.signature})
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect({result: "success"});
            });
            Promise.all(req).then(result => {
                done();
            });
        });
    }

    it('GET /address/plain', function(done) {
        request(app)
            .get('/ajax/address/plain')
            .query({ address: "SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2"})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                chai.expect(res.body).to.include({addressPlain: "SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2"})
            }).then(() => {
                done();
            });
    });

    it('GET /address/encode', function(done) {
        request(app)
            .get('/ajax/address/encode')
            .query({ address: "9081FCCB41F8C8409A9B99E485E0E28D23BD6304EF7215E01A"})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                chai.expect(res.body).to.include(
                    {addressPlain: "SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2", addressPretty: "SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2"})
            }).then(() => {
                done();
            });
    });

    it('GET /address/decode', function(done) {
        Promise.all([
            request(app)
                .get('/ajax/address/decode')
                .query({ address: "SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2"})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                    chai.expect(res.body).to.include(
                        {address: "9081FCCB41F8C8409A9B99E485E0E28D23BD6304EF7215E01A"})
                }),
            request(app)
                .get('/ajax/address/decode')
                .query({ address: "SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2"})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                    chai.expect(res.body).to.include(
                        {address: "9081FCCB41F8C8409A9B99E485E0E28D23BD6304EF7215E01A"})
                })
        ]).then(() => {
            done();
        });
    });

});