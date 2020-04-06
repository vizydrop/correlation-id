const utils = require(`./utils`);

module.exports = function expressMiddleware(correlator, opts = {}) {
    return function (req, res, next) {
        if (correlator.getId()) {
            next();
        } else {
            correlator.bindEmitter(req);
            correlator.bindEmitter(req.socket);
            correlator.bindEmitter(res);

            correlator.withId(req.correlationId || req.get(utils.getHeaderName(opts)), () => {
                utils.rebindOnFinished(correlator, res);

                const correlationId = correlator.getId();
                req.correlationId = correlationId;
                res.set(utils.getHeaderName(opts), correlationId);
                res.set(utils.getResponseHeaderName(opts), correlationId);
                next();
            });
        }
    };
};
