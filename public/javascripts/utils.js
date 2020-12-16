(() => {
    function endian(hex) {
        const result = [];
        let len = hex.length - 2;
        while (len >= 0) {
            result.push(hex.substr(len, 2));
            len -= 2;
        }
        return result.join('');
    }

    function uint8ArrayToHex (arrayBuffer) {
        return [...new Uint8Array(arrayBuffer)]
            .map (b => b.toString(16).padStart(2, "0"))
            .join ("")
            .toUpperCase();
    }

    function hexToUint8Array(hex) {
        return new Uint8Array(hex.toLowerCase().match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }))
    }

    async function publicKeyToHexAddress(publicKey, prefix = "98") {
        const a = await hashwasm.sha3(hexToUint8Array(publicKey), 256)
            .then((sha3ed) => {
                return hashwasm.ripemd160(hexToUint8Array(sha3ed))
            });
        const b = prefix + a;
        const check = await hashwasm.sha3(hexToUint8Array(b), 256);
        const c = b + check.substr(0, 6);
        return c.toUpperCase();
    }

    async function getTransactionHash(signedTxPayload, generationHash) {
        const hashInputPayload =
            signedTxPayload.substr(8 * 2,64 * 2) +
            signedTxPayload.substr((8 + 64) * 2,32 * 2) +
            generationHash +
            signedTxPayload.substr((8 + 64 + 32 + 4) * 2);
        const hashed = await hashwasm.sha3(hexToUint8Array(hashInputPayload), 256);
        return hashed.toUpperCase();
    }

    var RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    var RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
    var CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

    // https://github.com/LinusU/base32-encode
    function base32Encode (buffer, variant, options) {

        options = options || {}
        var alphabet, defaultPadding

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = RFC4648
                defaultPadding = true
                break
            case 'RFC4648-HEX':
                alphabet = RFC4648_HEX
                defaultPadding = true
                break
            case 'Crockford':
                alphabet = CROCKFORD
                defaultPadding = false
                break
            default:
                throw new Error('Unknown base32 variant: ' + variant)
        }

        var padding = (options.padding !== undefined ? options.padding : defaultPadding)
        var length = buffer.byteLength
        var view = new Uint8Array(buffer)

        var bits = 0
        var value = 0
        var output = ''

        for (var i = 0; i < length; i++) {
            value = (value << 8) | view[i]
            bits += 8

            while (bits >= 5) {
                output += alphabet[(value >>> (bits - 5)) & 31]
                bits -= 5
            }
        }

        if (bits > 0) {
            output += alphabet[(value << (5 - bits)) & 31]
        }

        if (padding) {
            while ((output.length % 8) !== 0) {
                output += '='
            }
        }

        return output
    }


    // https://github.com/LinusU/base32-decode
    function base32Decode (input, variant) {

        function readChar (alphabet, char) {
            var idx = alphabet.indexOf(char)

            if (idx === -1) {
                throw new Error('Invalid character found: ' + char)
            }

            return idx
        }

        var alphabet

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = RFC4648
                input = input.replace(/=+$/, '')
                break
            case 'RFC4648-HEX':
                alphabet = RFC4648_HEX
                input = input.replace(/=+$/, '')
                break
            case 'Crockford':
                alphabet = CROCKFORD
                input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')
                break
            default:
                throw new Error('Unknown base32 variant: ' + variant)
        }

        var length = input.length

        var bits = 0
        var value = 0

        var index = 0
        var output = new Uint8Array((length * 5 / 8) | 0)

        for (var i = 0; i < length; i++) {
            value = (value << 5) | readChar(alphabet, input[i])
            bits += 5

            if (bits >= 8) {
                output[index++] = (value >>> (bits - 8)) & 255
                bits -= 8
            }
        }

        return output.buffer
    }

    function getBase32DecodeAddress(plainOrPrettyAddress) {
        const plainAddress = plainOrPrettyAddress.replace(/-/g, '')
        return uint8ArrayToHex(base32Decode(plainAddress, 'RFC4648'))
    }

    function getBase32EncodeAddress(hexAddress) {
        const a = hexAddress + "00"
        const b = base32Encode(hexToUint8Array(a), 'RFC4648')
        return b.substr(0, 39)
    }

    window.utils = {
        endian,
        uint8ArrayToHex,
        hexToUint8Array,
        publicKeyToHexAddress,
        getTransactionHash,
        getBase32DecodeAddress,
        getBase32EncodeAddress
    }
})();
