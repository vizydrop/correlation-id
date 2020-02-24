const utils = require(`./utils`);

module.exports = function enhanceGot(correlator, opts) {
    return function enhance(got) {
        return got.extend({
            hooks: {
                beforeRequest: [
                    (requestOptions) => {
                        const headerName = utils.getHeaderName(opts);
                        // eslint-disable-next-line no-param-reassign
                        requestOptions.headers[headerName] = correlator.getId();
                    },
                ],
            },
        });
    };
};
