module.exports = Receptacle;
var cache      = Receptacle.prototype;

/**
 * Creates a cache with a maximum key size.
 *
 * @constructor
 * @param {Object} options
 * @param {Number} [options.max=Infinity] the maximum number of keys allowed in the cache (lru).
 * @param {Array} [options.items=[]] the default items in the cache.
 */
function Receptacle (options) {
	options    = options || {};
	this.max   = options.max || Infinity;
	this.items = options.items || [];
	this.size  = this.items.length;

	// Setup initial timers and indexes for the cache.
	for (var item, ttl, i = this.items.length; i--;) {
		item = this.items[i];
		ttl  = new Date(item.expires) - new Date;
		this.items[item.key] = item;
		if (ttl > 0) this._timeout(item.key, ttl);
	}
}

/**
 * Tests if a key is currently in the cache.
 * Does not check if slot is empty.
 *
 * @param {String} key - the key to retrieve from the cache.
 * @return {Boolean}
 */
cache.has = function (key) {
	return key in this.items;
};

/**
 * Retrieves a key from the cache and marks it as recently used.
 *
 * @param {String} key - the key to retrieve from the cache.
 * @return {*}
 */
cache.get = function (key) {
	if (!this.has(key)) return null;
	var record = this.items[key];
	// Move to front of the line.
	this.items.splice(this.items.indexOf(record), 1);
	this.items.push(record);
	return record.value;
};

/**
 * Puts a key into the cache with an optional expiry time.
 *
 * @param {String} key - the key for the value in the cache.
 * @param {*} value - the value to place at the key.
 * @param {Number} [options.ttl] - a time after which the key will be removed.
 * @return {Receptacle}
 */
cache.set = function (key, value, options) {
	var oldRecord = this.items[key];
	var record    = this.items[key] = { key: key, value: value };

	if (oldRecord) {
		// Replace an old key.
		clearInterval(oldRecord.timeout);
		this.items.splice(this.items.indexOf(oldRecord), 1, record);
	} else {
		// Remove least used item if needed.
		if (this.items.length >= this.max) this.del(this.items[0].key);
		// Add a new key.
		this.items.unshift(record);
		this.size++;
	}

	// Setup key expiry.
	if (options && "ttl" in options) this.expire(key, options.ttl);

	return this;
};

/**
 * Deletes an item from the cache.
 *
 * @param {String} key - the key to remove.
 * @return {Receptacle}
 */
cache.delete = function (key) {
	var record = this.items[key];
	if (!record) return false;
	this.items.splice(this.items.indexOf(record), 1);
	clearTimeout(record.timeout);
	delete this.items[key];
	this.size--;
	return this;
};

/**
 * Utility to register a key that will be removed after some time.
 *
 * @param {String} key - the key to remove.
 * @param {Number} [ms] - the timeout before removal.
 * @return {Receptacle}
 */
cache.expire = function (key, ms) {
	ms         = ms || 0;
	var record = this.items[key];

	if (typeof ms !== "number" || isNaN(ms) || ms < 0)
		throw new TypeError("Receptacle TTL must be a positive number.");

	if (!record) return this;
	record.timeout = setTimeout(this.delete.bind(this, record.key), ms);
	record.expires = ms + new Date;
	return this;
}

/**
 * Deletes all items from the cache.
 * @return {Receptacle}
 */
cache.clear = function () {
	for (var i = this.items.length; i--;) clearTimeout(this.items[i].timeout);
	this.items = [];
	this.size  = 0;
	return this;
};