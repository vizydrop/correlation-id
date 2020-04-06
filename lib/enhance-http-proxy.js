const utils = require(`./utils`);

module.exports = function enhanceHttpProxy(correlator, opts = {}) {
    return function enhancer(proxy) {
        proxy.on(`proxyReq`, (proxyReq, req) => {
            proxyReq.setHeader(
                utils.getHeaderName(opts),
                correlator.getId() || req.correlationId || req.get(utils.getHeaderName(opts)),
            );
        });

        proxy.on(`proxyRes`, (proxyRes, req, res) => {
            const correlationId = correlator.getId() ||
                req.correlationId ||
                req.get(utils.getHeaderName(opts)) ||
                res.get(utils.getResponseHeaderName(opts));
            res.setHeader(
                utils.getResponseHeaderName(opts),
                correlationId,
            );
        });
    };
};
