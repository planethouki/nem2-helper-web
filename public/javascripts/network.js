
const app = new Vue({
    el: '#app',
    data: {
        endpoints: [
            { name: "planet", label: "catapult48gh23s.xyz" },
            { name: "44uk", label: "catapult-test.44uk.net" },
            { name: "daoka", label: "catapult-test.daoka.ml" },
            { name: "soralis", label: "catapult-test.soralis.org" },
        ],
        endpointSelection: "planet",
        s_address: '',
        s_mosaics: '',
        q_address: '',
        q_namespaces: '',
        r_namespace: '',
        r_mosaics: '',
        t_address: '',
        t_multisig_graph: ''
    },
    mounted: function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, {});
    },
    methods: {
        s_sample: function() {
            this.s_address = 'SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2';
            this.$refs.s_focus.focus();
        },
        q_sample: function() {
            this.q_address = 'SCA7ZS-2B7DEE-BGU3TH-SILYHC-RUR32Y-YE55ZB-LYA2';
            this.$refs.q_focus.focus();
        },
        r_sample: function() {
            this.r_namespace = 'foo.sub';
            this.$refs.r_focus.focus();
        },
        t_sample: function() {
            this.t_address = 'SAG2ZE-35OZ6B-LCFU7B-G7ZG3A-5CI3RM-4G5STL-7WB6';
            this.$refs.t_focus.focus();
        },
        t_draw: function(graph) {
            google.charts.load('current', {packages:["orgchart"]});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Manager');
                data.addColumn('string', 'ToolTip');
                data.addRows(graph);
                var chart = new google.visualization.OrgChart(document.getElementById('t-chart'));
                chart.draw(data, {
                    allowHtml:true,
                    nodeClass:"t-nodeClass",
                    selectedNodeClass:"t-selectedNodeClass",
                });
            }
        }
    },
    watch: {
        endpointSelection: function(newVal) {
            console.log(newVal);
        },
        s_address: async function(newVal) {
            const response = await axios.get('/ajax/address/balance', { params: {address: newVal, endpoint: this.endpointSelection}});
            this.s_mosaics = response.data.mosaics;
        },
        q_address: async function(newVal) {
            const response = await axios.get('/ajax/address/namespaces', { params: {address: newVal, endpoint: this.endpointSelection}});
            this.q_namespaces = response.data.namespaces;
        },
        r_namespace: async function(newVal) {
            const response = await axios.get('/ajax/namespace/mosaics', { params: {namespace: newVal, endpoint: this.endpointSelection}});
            this.r_mosaics = response.data.mosaics;
        },
        t_address: async function(newVal) {
            const response = await axios.get('/ajax/address/multisig/graph', { params: {address: newVal, endpoint: this.endpointSelection}});
            this.t_draw(response.data.graph);
        },
    }
});