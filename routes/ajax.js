const express = require('express');
const router = express.Router();
const lib = require('./lib');

router.post('/node', async function(req, res, next) {
    try {
        const url1 = req.body.url;
        if (!url1) throw new Error("invalid data");
        if (url1.length === 0) throw new Error("invalid data");
        const url2 = url1.startsWith('https') ? url1.replace(/^https/, "") : url1;
        const url3 = url2.startsWith('http') ? url1.replace(/^http/, "") : url2;
        const [host, port] = url3.split(":");

        if (!host) throw new Error("invalid host");
        if (!port) throw new Error("invalid port");

        const { nodeInfo } = await lib.nodeInfo(host, Number(port));

        res.json({ info: nodeInfo, message: "success" });
    } catch (e) {
        res.json({ message: e.message });
    }
});

module.exports = router;
