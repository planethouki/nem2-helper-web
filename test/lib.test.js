const chai = require('chai');
const assert = chai.assert;
const lib = require('../routes/lib');

describe('nodeInfoParser', () => {
    it('properties', async () => {
        const data = "6900000004000A00BD1359CF93AE4C269F7D8840393B703124E34B79A401299497D9290A7B332CC46C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD05000000DC1E980018626561636F6E2D30312D61702D736F757468656173742D31"
        const obj = lib.test.nodeInfoParser(Buffer.from(data, 'hex'));
        assert.property(obj, 'version');
        assert.property(obj, 'publicKey');
        assert.property(obj, 'networkGenerationHash');
        assert.property(obj, 'roles');
        assert.property(obj, 'port');
        assert.property(obj, 'networkIdentifier');
        assert.property(obj, 'host');
        assert.property(obj, 'friendlyName');
        assert.notProperty(obj, 'nodePublicKey');
        assert.equal(obj.version, 655364);
        assert.equal(obj.publicKey, 'BD1359CF93AE4C269F7D8840393B703124E34B79A401299497D9290A7B332CC4');
        assert.equal(obj.networkGenerationHash, '6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD');
        assert.equal(obj.roles, 5);
        assert.equal(obj.port, 7900);
        assert.equal(obj.networkIdentifier, 152);
        assert.equal(obj.host, '');
        assert.equal(obj.friendlyName, 'beacon-01-ap-southeast-1');
    });
});
