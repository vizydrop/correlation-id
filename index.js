const cls = require(`cls-hooked`);
const uuid = require(`uuid`);

module.exports = (opts = {}) => {
    if (opts.generateDefaultId && typeof opts.generateDefaultId !== `function`) {
        throw new Error(`generateDefaultId must be a function`);
    }

    if (opts.namespaceName && typeof opts.namespaceName !== `string`) {
        throw new Error(`namespaceName must be a string`);
    }

    const store = cls.createNamespace(opts.namespaceName || `correlation-id-namespace`);

    const generateDefaultId = () => {
        return opts.generateDefaultId ? opts.generateDefaultId() : uuid.v4();
    };

    const CORRELATION_ID_KEY = `correlation-id`;

    const withId = (id, fn) => store.run(() => {
        store.set(CORRELATION_ID_KEY, id || generateDefaultId());
        fn();
    });

    const getId = () => store.get(CORRELATION_ID_KEY);
    const bindEmitter = (emitter) => store.bindEmitter(emitter);
    const bind = (fn) => store.bind(fn);

    return {
        withId,
        getId,
        bindEmitter,
        bind
    }
};
