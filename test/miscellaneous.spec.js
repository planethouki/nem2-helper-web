const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const chai = require('chai');


describe('miscellaneous', function() {

    it('GET /sha3/256', function(done) {
        const tvs = JSON.parse(fs.readFileSync("test/test-vectors/0.test-sha3-256.json"));
        const req = tvs.slice(0,100).map(tv => {
            return request(app)
                .get('/ajax/sha3/256')
                .query({ payload: tv.data })
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({hash: tv.sha3});
        });
        Promise.all(req).then(result => {
            done();
        });
    });

});