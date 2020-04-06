let headerName;
let responseHeaderName;

const utils = {
    getHeaderName: function getHeaderName(opts) {
        if (headerName) {
            return headerName;
        }

        if (opts.httpHeaderParamName && typeof opts.httpHeaderParamName !== `string`) {
            throw new Error(`httpHeaderParamName must be a string`);
        }

        headerName = opts.httpHeaderParamName || `x-correlation-id`;
        return headerName;
    },
    getResponseHeaderName: function getResponseHeaderName(opts) {
        if (responseHeaderName) {
            return responseHeaderName;
        }

        responseHeaderName = opts.httpResponseHeaderParamName || utils.getResponseHeaderName(opts);
        return responseHeaderName;
    },
    rebindOnFinished: function rebindOnFinished(correlator, container) {
        if (container.__onFinished) { // eslint-disable-line no-underscore-dangle
            // __onFinished is used by package that are used by koa itself (Application.handleRequest)
            // and morgan to run tasks on response end
            // lib creates 1 field to store all on finish listeners in queue
            container.__onFinished = correlator.bind(container.__onFinished); // eslint-disable-line
        }
    },
};

module.exports = utils;
