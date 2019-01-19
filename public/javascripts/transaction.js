
const app = new Vue({
    el: '#app',
    data: {
        h_hash: '',
        h_hash_decoded: '',
        i_type: '',
        i_type_name: '',
        j_payload: '',
        j_hash: '',
        k_payload: '',
        k_hash: '',
        l_payload: '',
        l_hash: '',
    },
    methods: {
        h_sample: function() {
            this.h_hash = 'PC6RI4lWCWobmSAQ1l5k6vVlTI8YpmOPTgmoSaYpCQE=';
            this.$refs.h_focus.focus();
        },
        i_sample: function() {
            this.i_type = '414C';
            this.$refs.i_focus.focus();
        },
        j_sample: function() {
            this.j_payload = '095B4FCD1F88F1785E59';
            this.$refs.j_focus.focus();
        },
        k_sample: function() {
            this.k_payload = '095B4FCD1F88F1785E59';
            this.$refs.k_focus.focus();
        },
        l_sample: function() {
            this.l_payload = 'CA0000005FBA8E69C35084EB80CC5A2BAF484EC559638F9A73A256ED63198FF1E0034B40CF05A38D61D1F548F9E35E4CA338F2E11FCEEBAEB38650476CD55593CE858B035D9513282B65A12A1B68DCB67DB64245721F7AE7822BE441FE813173803C512C0390415200000000000000005F1EB1E51300000029CF5FD941AD25D540420F00000000003C0000000000000003F3E167CCBABF33D64806CCF2544C4740FE75A2957847D6F7BDF19316DE63478390758EB47C28D6143BAA3DE6A8D9C319B503A1BFD8E789E9E2';
            this.$refs.l_focus.focus();
        },
    },
    watch: {
        h_hash: async function(newVal) {
            const response = await axios.get('/ajax/base64/decode', { params: {payload: newVal}});
            this.h_hash_decoded = response.data.decoded;
        },
        i_type: async function(newVal) {
            const response = await axios.get('/ajax/transaction/type', { params: {type: newVal}});
            this.i_type_name = response.data.name;
        },
        j_payload: async function(newVal) {
            const response = await axios.get('/ajax/sha3/256', { params: {payload: newVal}});
            this.j_hash = response.data.hash;
        },
        k_payload: async function(newVal) {
            const response = await axios.get('/ajax/sha3/512', { params: {payload: newVal}});
            this.k_hash = response.data.hash;
        },
        l_payload: async function(newVal) {
            const response = await axios.get('/ajax/transaction/hash/payload', { params: {payload: newVal}});
            this.l_hash = response.data.hash;
        },
    }
});