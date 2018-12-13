
const app = new Vue({
    el: '#app',
    data: {
        e_namespace: '',
        e_namespace_id_uint64: '',
        e_namespace_id_hex: '',
        f_sub_namespace: '',
        f_parent_namespace: '',
        f_namespace_id_uint64: '',
        f_namespace_id_hex: '',
        g_mosaic: '',
        g_mosaic_id_uint64: '',
        g_mosaic_id_hex: '',
    },
    watch: {
        e_namespace: async function(newVal) {
            const response = await axios.get('/ajax/namespace', { params: {namespace: newVal}});
            this.e_namespace_id_uint64 = response.data.namespaceIdUInt64;
            this.e_namespace_id_hex = response.data.namespaceIdHex;
        },
        f_sub_namespace: function() {
            this.f_method();
        },
        f_parent_namespace: function() {
            this.f_method();
        },
        g_mosaic: async function(newVal) {
            const response = await axios.get('/ajax/mosaic', { params: {mosaic: newVal}});
            this.g_mosaic_id_uint64 = response.data.mosaicIdUInt64;
            this.g_mosaic_id_hex = response.data.mosaicIdHex;
        },
    },
    methods: {
        f_method: async function() {
            const response = await axios.get('/ajax/subnamespace', { params: {
                parentNamespace: this.f_parent_namespace,
                subNamespace: this.f_sub_namespace
            }});
            this.f_namespace_id_uint64 = response.data.namespaceIdUInt64;
            this.f_namespace_id_hex = response.data.namespaceIdHex;
        }
    }
});