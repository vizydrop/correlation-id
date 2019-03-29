const cls = require(`cls-hooked`);
const uuid = require(`uuid`);

function validateOptions(opts = {}) {
    if (opts.generateDefaultId && typeof opts.generateDefaultId !== `function`) {
        throw new Error(`generateDefaultId must be a function`);
    }

    if (opts.namespaceName && typeof opts.namespaceName !== `string`) {
        throw new Error(`namespaceName must be a string`);
    }
}

module.exports = function correlator(opts = {}) {
    validateOptions(opts);

    const store = cls.createNamespace(opts.namespaceName || `correlation-id-namespace`);

    function generateDefaultId() {
        return opts.generateDefaultId ? opts.generateDefaultId() : uuid.v4();
    }

    const CORRELATION_ID_KEY = `correlation-id`;

    function withId(id, fn) {
        store.run(() => {
            store.set(CORRELATION_ID_KEY, id || generateDefaultId());
            fn();
        });
    }

    function getId() {
        return store.get(CORRELATION_ID_KEY);
    }

    return {
        withId,
        getId,
        bindEmitter: store.bindEmitter.bind(store),
        bind: store.bind.bind(store),
        generateId: generateDefaultId,
    };
};
