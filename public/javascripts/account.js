
const app = new Vue({
    el: '#app',
    data: {
        a_privateKey: '',
        a_publicKey: '',
        b_publicKey: '',
        b_address_plain: '',
        b_address_pretty: '',
        c_address: '',
        c_address_plain: '',
        c_address_pretty: '',
        d_address: '',
        d_address_decoded: '',
        v_address: '',
        v_address_plain: '',
        m_private_key: '',
        m_data: '',
        m_signature: '',
        n_signature: '',
        n_public_key: '',
        n_data: '',
        n_result: '',
        y_address: '',
        y_address_decoded: ''
    },
    methods: {
        a_sample: function() {
            this.a_privateKey = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';
            this.$refs.a_focus.focus();
        },
        b_sample: function() {
            this.b_publicKey = 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26';
            this.$refs.b_focus.focus();
        },
        c_sample: function() {
            this.c_address = '9081FCCB41F8C8409A9B99E485E0E28D23BD6304EF7215E01A';
            this.$refs.c_focus.focus();
        },
        d_sample: function() {
            this.d_address = 'SCA7ZS2B7DEEBGU3THSILYHCRUR32YYE55ZBLYA2';
            this.$refs.d_focus.focus();
        },
        v_sample: function() {
            this.v_address = 'SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2';
            this.$refs.v_focus.focus();
        },
        m_sample: function() {
            this.m_private_key = '25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E';
            this.m_data = '48656C6C6F204E656D3221';
            this.$refs.m_focus2.focus();
            this.$nextTick(function() {
                this.$refs.m_focus1.focus();
            });
        },
        n_sample: function() {
            this.n_signature = 'CB5E55B0C71BB7616CE3077F0EFCBBBB79F9FF88AA2A978F5702F00F71056AEAC98A82D433A40431BD056277F5ECA9DF7FB6E0EAB7CC08C740BD61B89EB15700';
            this.n_public_key = 'AC1A6E1D8DE5B17D2C6B1293F1CAD3829EEACF38D09311BB3C8E5A880092DE26';
            this.n_data = '48656C6C6F204E656D3221';
            this.$refs.n_focus3.focus();
            this.$nextTick(function() {
                this.$refs.n_focus2.focus();
                this.$nextTick(function() {
                    this.$refs.n_focus1.focus();
                });
            });
        },
        m_func: async function() {
            const response = await axios.post('/ajax/privkey/sign', {
                privkey: this.m_private_key,
                data: this.m_data
            });
            this.m_signature = response.data.signature;
        },
        n_func: async function() {
            const response = await axios.get('/ajax/pubkey/verify', { params: {
                signature: this.n_signature,
                pubkey: this.n_public_key,
                data: this.n_data
            }});
            this.n_result = response.data.result;
        },
        y_sample: function() {
            this.y_address = 'kCLZ5eQKN2n8TJqEGSpHdxJt9Wp83ciA2Q==';
            this.$refs.y_focus.focus();
        },
    },
    watch: {
        a_privateKey: async function(newVal) {
            const response = await axios.post('/ajax/privkey', {privkey: newVal});
            this.a_publicKey = response.data.pubkey;
        },
        b_publicKey: async function(newVal) {
            const response = await axios.get('/ajax/pubkey', { params: {pubkey: newVal}});
            this.b_address_plain = response.data.addressPlain;
            this.b_address_pretty = response.data.addressPretty;
        },
        c_address: async function(newVal) {
            const response = await axios.get('/ajax/address/encode', { params: {address: newVal}});
            this.c_address_plain = response.data.addressPlain;
            this.c_address_pretty = response.data.addressPretty;
        },
        d_address: async function(newVal) {
            const response = await axios.get('/ajax/address/decode', { params: {address: newVal}});
            this.d_address_decoded = response.data.address;
        },
        v_address: async function(newVal) {
            const response = await axios.get('/ajax/address/plain', { params: {address: newVal}});
            this.v_address_plain = response.data.addressPlain;
        },
        m_private_key: async function() {
            this.m_func();
        },
        data: async function() {
            this.m_func();
        },
        n_signature: async function() {
            this.n_func();
        },
        n_public_key: async function() {
            this.n_func();
        },
        n_data: async function() {
            this.n_func();
        },
        y_address: async function(newVal) {
            const response = await axios.get('/ajax/base64/decode', { params: {payload: newVal}});
            this.y_address_decoded = response.data.decoded;
        },
    }
});