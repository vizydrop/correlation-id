const createCorrelator = require(`./correlator`);
const createEnhanceRequest = require(`./enhance-request`);
const createEnhanceHttpProxy = require(`./enhance-http-proxy`);
const createKoaMiddleware = require(`./koa-middleware`);
const createExpressMiddleware = require(`./express-middleware`);

module.exports = function createCorrelationId(opts = {}) {
    const correlator = createCorrelator(opts);

    return {
        correlator,
        enhanceRequest: createEnhanceRequest(correlator, opts),
        enhanceHttpProxy: createEnhanceHttpProxy(correlator, opts),
        koaMiddleware: createKoaMiddleware(correlator, opts),
        expressMiddleware: createExpressMiddleware(correlator, opts),
    };
};
