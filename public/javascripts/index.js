axios.defaults.baseURL = "/ajax"

new Vue({
    el: '#a-account',
    data: {
        privateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        address: ""
    },
    computed: {
        publicKey() {
            try {
                const privateKey = utils.hexToUint8Array(this.privateKey);
                const { publicKey } = nacl.sign.keyPair.fromSeed(privateKey);
                return utils.uint8ArrayToHex(publicKey).toUpperCase();
            } catch (e) {
                console.error(e);
                return "invalid private key";
            }
        }
    },
    created() {
        this.debouncedGetAddress = _.debounce(this.getAddress, 500)
        this.debouncedGetAddress()
    },
    watch: {
        privateKey: function() {
            this.debouncedGetAddress()
        },
    },
    methods: {
        getAddress() {
            try {
                utils.publicKeyToHexAddress(this.publicKey)
                    .then((hexAddress) => {
                        this.address = utils.getBase32EncodeAddress(hexAddress)
                    });
            } catch (e) {
                this.address = "invalid private key";
            }
        }
    }
});

new Vue({
    el: '#n-node',
    data: {
        url: "beacon-01.ap-southeast-1.0.10.0.x.symboldev.network:7900",
        data: {}
    },
    computed: {
    },
    created() {
        this.debouncedGetNodeInfo = _.debounce(this.getNodeInfo, 500)
    },
    methods: {
        getNodeInfo() {
            axios.post("/node", { url: this.url })
                .then((res) => {
                    this.data = res.data;
                });
        }
    }
});
