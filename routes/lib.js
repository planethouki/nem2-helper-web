const tls = require('tls');

async function nodeConnection(host, port, sendData) {
    const contextOptions = {
        minVersion: 'TLSv1.3',
        sigalgs: 'ed25519'
    };
    const connectionOptions = {
        host: host,
        port: port,
        secureContext: tls.createSecureContext(contextOptions),
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined
    };
    const serverSocket = tls.connect(connectionOptions);

    await new Promise((resolve) => {
        serverSocket
            .on('connect', resolve)
    })

    await new Promise((resolve) => {
        serverSocket.write(Buffer.from(sendData, 'hex'), resolve)
    })

    const receiveData = await new Promise((resolve) => {
        const packet = [];
        serverSocket.on('data', data => {
            packet.push(data);
            const packetSize = packet[0].readUInt32LE();
            const currentSize = packet.reduce((accumulator, buffer) => {
                return accumulator + buffer.length;
            }, 0);
            if (packetSize === currentSize) {
                const concatHex = packet.reduce((accumulator, buffer) => {
                    return accumulator + buffer.toString('hex');
                }, "");
                resolve(concatHex);
            }
        });
    });

    serverSocket.end();

    return {
        buffer: Buffer.from(receiveData.substr(16), 'hex'),
        cert: serverSocket.getPeerCertificate(true)
    };
}

/**
 *
 * @param {Buffer} buffer
 * @return {Object}
 */
function nodeInfoParser(buffer) {
    const nodeInfo = {};
    buffer.readUInt32LE(); // Node size
    nodeInfo.version = buffer.readUInt32LE(4);
    nodeInfo.publicKey = buffer.slice(8, 8 + 32).toString('hex').toUpperCase();
    nodeInfo.networkGenerationHash = buffer.slice(40, 40 + 32).toString('hex').toUpperCase();
    nodeInfo.roles = buffer.readUInt32LE(72);
    nodeInfo.port = buffer.readUInt16LE(76);
    nodeInfo.networkIdentifier = buffer.readUInt8(78);
    const hostSize = buffer.readUInt8(79);
    const friendlyNameSize = buffer.readUInt8(80);
    nodeInfo.host = (hostSize > 0 ? buffer.slice(81, 81 + hostSize) : Buffer.alloc(0)).toString();
    nodeInfo.friendlyName = (friendlyNameSize > 0 ? buffer.slice(81 + hostSize, 81 + hostSize + friendlyNameSize) : Buffer.alloc(0)).toString();
    return nodeInfo;
}

/**
 *
 * @param host
 * @param port
 * @return {Promise<{}>}
 */
async function nodeInfo(host, port) {
    const sendData = "0800000011010000";
    const { buffer } = await nodeConnection(host, port, sendData);
    return nodeInfoParser(buffer);
}

module.exports = {
    nodeInfo
}