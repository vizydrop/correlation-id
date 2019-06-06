const utils = require(`./utils`);

module.exports = function enhanceGot(correlator, opts) {
    return function enhance(got) {
        return got.extend({
            headers: {
                get [utils.getHeaderName(opts)]() {
                    return correlator.getId();
                },
            },
        });
    };
};
