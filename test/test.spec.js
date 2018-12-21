const request = require('supertest');
const app = require('../app');


describe('POST /ajax/privkey', function() {
    it('responds with json', function(done) {
        request(app)
            .post('/ajax/privkey')
            .send({privkey: '906053C9B0DEAA1A23867EC5F47AC7285CBAFCEE8BAA8188ACB1B988C40FD664'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({pubkey: 'F2A9A1A7800F89933CA57DEA7BE42E48501A4ECE90B4237C0C9A80605F41804C'})
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});


describe('GET /ajax/pubkey', function() {
    it('respond with json', function(done) {
        request(app)
            .get('/ajax/pubkey')
            .query({ pubkey: 'F2A9A1A7800F89933CA57DEA7BE42E48501A4ECE90B4237C0C9A80605F41804C' })
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({addressPretty: 'SCLGF7-ANRA5L-LVLTGB-Z6LCKI-WGSXTR-OEF245-R4LY', addressPlain: 'SCLGF7ANRA5LLVLTGBZ6LCKIWGSXTROEF245R4LY'})
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});