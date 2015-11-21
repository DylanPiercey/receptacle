var assert     = require("assert");
var Receptacle = require("../");

describe("Receptacle", function () {
	describe("#has", function () {
		it("should return true when a key is in use", function () {
			var cache = new Receptacle;
			cache.set("a", 1);
			cache.set("b", undefined);
			assert.equal(cache.has("a"), true);
			assert.equal(cache.has("b"), true);
		});

		it("should return false when a key is not in use", function () {
			var cache = new Receptacle;
			assert.equal(cache.has("a"), false);
		});
	});

	describe("#get", function () {
		it("should return a set key", function () {
			var cache = new Receptacle;
			cache.set("a", 1);
			cache.set("b", undefined);
			assert.equal(cache.get("a"), 1);
			assert.equal(cache.get("b"), undefined);
		});

		it("should return null when a key is missing", function () {
			var cache = new Receptacle;
			assert.equal(cache.get("a"), null);
		});
	});

	describe("#set", function () {
		it("should add a key to the cache that will expire", function (done) {
			var cache = new Receptacle;
			cache.set("a", 1, { ttl: 200 });
			assert.equal(cache.get("a"), 1);

			setTimeout(function () {
				assert.equal(cache.get("a"), null);
				done();
			}, 201);
		});

		it("should maintain most recently used items", function () {
			var cache = new Receptacle({ size: 3 });
			cache
				.set("a", 1)
				.set("b", 2)
				.set("c", 3)
				.get("b");

			assert.equal(cache.size, cache.items.length);
			assert.equal(cache.size, 3);
			assert.equal(cache.items[2].key, "b");
		});
	});

	describe("#expire", function () {
		it("should change an existing expiry", function (done) {
			var cache = new Receptacle;
			cache.set("a", 1, { ttl: 200 });
			cache.expire("a", 100);
			assert.equal(cache.get("a"), 1);

			setTimeout(function () {
				assert.equal(cache.get("a"), null);
				done();
			}, 101);
		});

		it("should set a new expiry", function (done) {
			var cache = new Receptacle;
			cache.set("a", 1);
			cache.expire("a", 100);
			assert.equal(cache.get("a"), 1);

			setTimeout(function () {
				assert.equal(cache.get("a"), null);
				done();
			}, 101);
		});
	});

	describe("#delete", function () {
		it("should remove a key", function () {
			var cache = new Receptacle;
			cache.set("a", 1);
			assert.equal(cache.get("a"), 1);
			cache.delete("a");
			assert.equal(cache.get("a"), null);
		});
	});

	describe("#clear", function () {
		it("should remove all keys", function () {
			var cache = new Receptacle;
			cache
				.set("a", 1)
				.set("b", 2)
				.set("c", 3);
			
			assert.equal(cache.size, 3);
			cache.clear();
			assert.equal(cache.size, 0);
		});
	});
});