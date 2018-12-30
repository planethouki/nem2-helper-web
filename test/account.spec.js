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

});