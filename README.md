# Correlation Id

## How to use
Create correlation id instance
```javascript
const {createCorrelationId} = require(`@vizydrop/correlation-id`);
const correlationId = createCorrelationId();
```

Integrate with `@vizydrop/logger`
```javascript
const {createLogger} = require(`@vizydrop/logger`);

const logger = createLogger({
    correlationId: {
        enabled: true,
        getCorrelationId: () => correlationId.correlator.getId(),
        emptyValue: `nocorrelation`,
    },
});
```

Register middleware. Support `koa` and `express`
```javascript
// koa
app.use(correlationId.koaMiddleware);
// express
app.use(correlationId.expressMiddleware);
```

Enhance request so each request will contain correlation id http header.
```javascript
const request = require(`request`);
const correlatedRequest = correlationId.enhanceRequest(request);
correlatedRequest.get(`http://anotherservice:10020/data`);
```

Enhance http proxy so each proxied request will contain correlation id http header.
```javascript
const httpProxy = require(`http-proxy`);
const proxy = httpProxy.createProxyServer({target: `http://anotherservice:10020/`});
correlationId.enhanceHttpProxy(proxy);
```

Run jobs. Jobs usually do not go through `express/koa` middleware so correlation id should be generated manually.
```javascript
function jobTask() {}

function runJob() {
    correlationId.correlator.withId(correlator.generateDefaultId(), () => {
        jobTask();
    });
}
```

## Settings

Custom settings can be passed as an object to `createCorrelationId` function.
- `generateDefaultId` - function that should return new correlation id. By default `uuid` is used.
- `namespaceName` - namespace for cls hook. Default value is `correlation-id-namespace`
- `httpHeaderParamName` - name of http header that contains correlation id value. Default value is `x-correlationid`

## Correlation ID API
- `expressMiddleware` - express middleware that runs next middlewares in scope of correlation id async hook
- `koaMiddleware` - koa middleware that runs next middlewares in scope of correlation id async hook
- `enhanceHttpRequest` - takes request and return new request instance that adds correlation id header by default
- `enhanceHttpProxy` - register additional listener that adds correlation id header by default
- `correlator.getId()` - returns current correlation id
- `correlator.withId(id, fn)` - run function and all subsequent function with specified correlation id
- `correlator.bindEmitter()` - see https://github.com/jeff-lewis/cls-hooked#namespacebindemitteremitter
- `correlator.bind()` - see https://github.com/jeff-lewis/cls-hooked#namespacebindemitteremitter
- `correlator.generateId()` - generates new correlation id

## Known issues
- does not work well with `bluebird.promisifyAll`. Alternative solution is to explicitly promisify using native promise
```javascript
const redis = require(`redis`);
const util = require(`util`);

const client = redis.createClient();

client.setAsync = util.promisify(client.set).bind(client);
client.getAsync = util.promisify(client.get).bind(client);
```

- does not work well with `mongoose` callbacks. Alternative solution is to use promisified functions.
```javascript
const mongoose = require(`mongooose`);
mongoose.Promise = global.Promise;

EntityModel.find({name: `name`}).then((value) => {
    // do something
});
```
