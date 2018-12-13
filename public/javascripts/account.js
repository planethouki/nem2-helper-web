
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
        }

    }
});