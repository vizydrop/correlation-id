const utils = require(`./utils`);

module.exports = function koaMiddleware(correlator, opts = {}) {
    return async function (ctx, next) {
        if (correlator.getId()) {
            await next();
        } else {
            correlator.bindEmitter(ctx.req);
            correlator.bindEmitter(ctx.req.socket);
            correlator.bindEmitter(ctx.res);
            await new Promise((resolve, reject) => {
                correlator.withId(ctx.request.correlationId || ctx.request.get(utils.getHeaderName(opts)), () => {
                    utils.rebindOnFinished(correlator, ctx.res);

                    const correlationId = correlator.getId();
                    ctx.request.correlationId = correlationId;
                    ctx.set(utils.getHeaderName(opts), correlationId);
                    next().then(resolve).catch(reject);
                });
            });
        }
    };
};
