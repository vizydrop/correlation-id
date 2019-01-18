const utils = require(`./utils`);

module.exports = function enhanceHttpProxy(correlator, opts = {}) {
    return function enhancer(proxy) {
        proxy.on(`proxyReq`, (proxyReq) => {
            proxyReq.setHeader(utils.getHeaderName(opts), correlator.getId());
        });
    };
};
