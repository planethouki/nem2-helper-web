
const app = new Vue({
    el: '#app',
    data: {
        o_high: '',
        o_low: '',
        o_number: '',
        p_timestamp: '',
        p_utc_string: '',
        u_payload: '',
        u_message_decoded: '',
        w_hex: '',
        w_dec: '',
    },
    methods: {
        o_sample: function() {
            this.o_low = '3692602683';
            this.o_high = '15';
            this.$refs.o_focus2.focus();
            this.$nextTick(function() {
                this.$refs.o_focus1.focus();
            });
        },
        p_sample: function() {
            this.p_timestamp = '68117112123';
            this.$refs.p_focus.focus();
        },
        u_sample: function() {
            this.u_payload = '48656C6C6F204E656D3221';
            this.$refs.u_focus.focus();
        },
        o_func: async function() {
            const response = await axios.get('/ajax/uint64/compact', { params: {
                    low: this.o_low,
                    high: this.o_high,
                }});
            this.o_number = response.data.compact;
        },
    },
    watch: {
        o_high: async function() {
            this.o_func();
        },
        o_low: async function() {
            this.o_func();
        },
        p_timestamp: async function(newVal) {
            const response = await axios.get('/ajax/timestamp/decode', { params: {timestamp: newVal}});
            this.p_utc_string = response.data.utcString;
        },
        u_payload: async function(newVal) {
            const response = await axios.get('/ajax/message/decode', { params: {payload: newVal}});
            this.u_message_decoded = response.data.decoded;
        },
        w_dec: async function(newVal, oldVal) {
            const num = Number(newVal);
            if (Number.isSafeInteger(num)) {
                const rowHex = num.toString(16).toUpperCase();
                if (rowHex.length % 2 === 0) {
                    this.w_hex = rowHex;
                } else {
                    this.w_hex = "0" + rowHex;
                }
            }
        },
        w_hex: async function(newVal, oldVal) {
            const num = Number("0x" + newVal);
            if (Number.isSafeInteger(num)) {
                this.w_dec = num.toString(10);
            }
        },
    }
});