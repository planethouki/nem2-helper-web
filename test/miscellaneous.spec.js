const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const chai = require('chai');


describe('miscellaneous', function() {

    const sha3_256 = JSON.parse(fs.readFileSync("test/test-vectors/0.test-sha3-256.json"));

    for (let i = 0; i < sha3_256.length / 100; i++) {
        it(`GET /sha3/256 part:${i}`, function (done) {
            const req = signPrivate.slice(i * 100, (i + 1) * 100).map(tv => {
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

});