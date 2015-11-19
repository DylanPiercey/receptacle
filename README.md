# Receptacle.
In memory cache for node and the browser that supports `lru` and `ttl` algorithms.

Items in the cache will move to the back queue when accessed and any key can optionally have an expiry time.

# Installation

#### Npm
```console
npm install receptacle
```

# Example

```js
var Receptacle = require('receptacle');
var cache      = new Receptacle({ max: 100 }); // Create a cache with max 100 items.

cache.set("item", 1, { ttl: 100 }); //-> Add item to cache (expire in 100ms).
cache.get("item"); //-> 1
cache.has("item"); //-> true
cache.expire("item", 50); //-> Expire in 50ms (instead of 100).
cache.delete("item"); //-> Delete item right away.
cache.clear(); //-> Empty the cache.
```

# Serialization
You can easily serialize and rehydrate your cache as JSON.

```js
var Receptacle = require('receptacle');
var cache      = new Receptacle({ max: 5 }); // Create a cache with max 5 items.

cache.set("a", 1, { ttl: 1000 });

var serialized = JSON.stringify(cache); //-> '{ "max": 5, "items": [...] }'

// Create a cache from the json which will retain all ttl information (and remove any keys that have expired).
var newCacheFromJSON = new Receptacle(JSON.parse(serialized));

```

# API

##`Receptacle({ size=Infinity, items=[] })`: Create a new cache.

##`#max`: Get the maximum size of the cache (default of Infinity).

##`#size`: Get the current number of items in the cache.

##`#has(key)`: Check if a key is in the cache, even if it's undefined.

##`#get(key)`: Retreive a key from the cache.

##`#set(key, value, options)`: Set a key in the cache, optionally setting a `ttl` option that will cause the value to expire.

##`#delete(key)`: Immediately remove a key from the cache.

##`#expire(key, [ms=0])`: Update the expire time for a key.

##`#clear()`: Remove all keys from the cache.

### Contributions

* Use gulp to run tests.

Please feel free to create a PR!