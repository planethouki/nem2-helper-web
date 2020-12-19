axios.defaults.baseURL = "/ajax"

new Vue({
    el: '#a-account',
    data: {
        privateKey: "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        address: "",
        hexAddress: "",
        hexAddressSha3: ""
    },
    computed: {
        publicKey() {
            try {
                if (this.privateKey.length === 0) {
                    return ""
                }
                const privateKey = utils.hexToUint8Array(this.privateKey);
                const { publicKey } = nacl.sign.keyPair.fromSeed(privateKey);
                return utils.uint8ArrayToHex(publicKey).toUpperCase();
            } catch (e) {
                console.error(e);
                return "";
            }
        },
        data() {
            return YAML.stringify({
                publicKey: this.publicKey,
                addressPlain: this.address,
                addressPretty: utils.plainToPretty(this.address),
                hexAddress: this.hexAddress,
                hexAddressSha3: this.hexAddressSha3
            })
        },
        isDataHidden() {
            return this.publicKey.length === 0;
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
                if (this.publicKey.length === 0) {
                    this.address = "";
                    this.hexAddress = "";
                    this.hexAddressSha3 = "";
                    return;
                }
                utils.publicKeyToHexAddress(this.publicKey)
                    .then((hexAddress) => {
                        this.hexAddress = hexAddress;
                        this.address = utils.getBase32EncodeAddress(hexAddress);
                        return utils.sha3(this.hexAddress);
                    })
                    .then((hexAddressSha3) => {
                        this.hexAddressSha3 = hexAddressSha3;
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
        data: "",
        message: ""
    },
    created() {
        this.debouncedGetNodeInfo = _.debounce(this.getNodeInfo, 500)
    },
    methods: {
        getNodeInfo() {
            this.data = "";
            this.message = "fetching...";
            const interval = setInterval(() => {
                this.message = this.message + ".";
            }, 1000);
            axios.post("/node", { url: this.url })
                .then((res) => {
                    this.data = YAML.stringify(res.data.info);
                    this.message = "";
                })
                .catch((e) => {
                    console.error(e);
                    this.data = "";
                    this.message = e.data.message;
                })
                .finally(() => {
                    clearInterval(interval);
                });
        }
    }
});
