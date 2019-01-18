const utils = require(`./utils`);

module.exports = function enhanceRequest(correlator, opts) {
    return function enhance(request) {
        return request.defaults({
            headers: {
                get [utils.getHeaderName(opts)]() {
                    return correlator.getId();
                },
            },
        });
    };
};
