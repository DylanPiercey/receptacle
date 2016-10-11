'use strict'

var assert = require('assert')
var Receptacle = require('../')

describe('Receptacle', function () {
  describe('#has', function () {
    it('should return true when a key is in use', function () {
      var cache = new Receptacle()
      cache.set('a', 1)
      cache.set('b', undefined)
      assert.equal(cache.has('a'), true)
      assert.equal(cache.has('b'), true)
    })

    it('should return false when a key is not in use', function () {
      var cache = new Receptacle()
      assert.equal(cache.has('a'), false)
    })
  })

  describe('#get', function () {
    it('should return a set key', function () {
      var cache = new Receptacle()
      cache.set('a', 1)
      cache.set('b', undefined)
      assert.equal(cache.get('a'), 1)
      assert.equal(cache.get('b'), undefined)
    })

    it('should return null when a key is missing', function () {
      var cache = new Receptacle()
      assert.equal(cache.get('a'), null)
    })
  })

  describe('#meta', function () {
    it('should return a set key', function () {
      var cache = new Receptacle()
      cache.set('a', 1, { meta: { custom: 1 } })
      cache.set('b', 1)
      assert.deepEqual(cache.meta('a'), { custom: 1 })
      assert.equal(cache.meta('b'), null)
    })

    it('should return null when a key is missing', function () {
      var cache = new Receptacle()
      assert.equal(cache.meta('a'), null)
    })
  })

  describe('#set', function () {
    it('should add a key to the cache', function () {
      var cache = new Receptacle()
      cache.set('a', 1)
      assert.equal(cache.get('a'), 1)
      cache.set('a', 2)
      assert.equal(cache.get('a'), 2)
    })

    it('should add a key to the cache that will expire', function (done) {
      var cache = new Receptacle()
      cache.set('a', 1, { ttl: 200 })
      assert.equal(cache.get('a'), 1)

      setTimeout(function () {
        assert.equal(cache.get('a'), null)
        done()
      }, 201)
    })

    it("should auto reset a expiry for a 'reset' key", function (done) {
      var cache = new Receptacle()
      cache.set('a', 1, { ttl: 200, refresh: true })
      assert.equal(cache.get('a'), 1)

      setTimeout(function () {
        assert.equal(cache.get('a'), 1)
        setTimeout(function () {
          assert.equal(cache.get('a'), 1)
          setTimeout(function () {
            assert.equal(cache.get('a'), null)
            done()
          }, 201)
        }, 150)
      }, 150)
    })

    it('should maintain most recently used items', function () {
      var cache = new Receptacle({ max: 3 })
      cache
        .set('a', 1)
        .set('b', 2)
        .set('c', 3)
        .set('d', 4)
        .get('b')

      assert.equal(cache.size, cache.items.length)
      assert.equal(cache.size, 3)
      assert.equal(cache.items[2].key, 'b')
    })
  })

  describe('#expire', function () {
    it('should change an existing expiry', function (done) {
      var cache = new Receptacle()
      cache.set('a', 1, { ttl: 200 })
      cache.expire('a', 100)
      assert.equal(cache.get('a'), 1)

      setTimeout(function () {
        assert.equal(cache.get('a'), null)
        done()
      }, 101)
    })

    it('should set a new expiry', function (done) {
      var cache = new Receptacle()
      cache.set('a', 1)
      cache.expire('a', 100)
      assert.equal(cache.get('a'), 1)

      setTimeout(function () {
        assert.equal(cache.get('a'), null)
        done()
      }, 101)
    })

    it('should set an immediate expiry', function (done) {
      var cache = new Receptacle()
      cache.set('a', 1)
      cache.expire('a')
      assert.equal(cache.get('a'), 1)

      setTimeout(function () {
        assert.equal(cache.get('a'), null)
        done()
      }, 0)
    })

    it('should ignore mssing field', function (done) {
      var cache = new Receptacle()
      cache.expire('a')
      assert.equal(cache.get('a'), null)

      setTimeout(function () {
        assert.equal(cache.get('a'), null)
        done()
      }, 0)
    })

    it('should support a ttl string', function (done) {
      var cache = new Receptacle()
      cache.set('a', 1)
      cache.expire('a', '100ms')
      assert.equal(cache.get('a'), 1)

      setTimeout(function () {
        assert.equal(cache.get('a'), null)
        done()
      }, 101)
    })

    it('should error with an invalid ttl', function () {
      var cache = new Receptacle()
      cache.set('a', 1)

      assert.throws(function () {
        cache.expire('a', true)
      })
    })
  })

  describe('#delete', function () {
    it('should remove a key', function () {
      var cache = new Receptacle()
      cache.set('a', 1)
      assert.equal(cache.get('a'), 1)
      cache.delete('a')
      assert.equal(cache.get('a'), null)
    })

    it('should ignore mssing field', function () {
      var cache = new Receptacle()
      cache.delete('a')
      assert.equal(cache.get('a'), null)
    })
  })

  describe('#clear', function () {
    it('should remove all keys', function () {
      var cache = new Receptacle()
      cache
        .set('a', 1)
        .set('b', 2)
        .set('c', 3)

      assert.equal(cache.size, 3)
      cache.clear()
      assert.equal(cache.size, 0)
    })
  })

  describe('#toJSON', function () {
    it('should convert from and to json', function () {
      var cache = new Receptacle()
      cache
        .set('a', 1)
        .set('b', 2)
        .set('c', 3, { ttl: 1000 })
      var json = cache.toJSON()

      assert.equal(cache.id, json.id)
      assert.equal(cache.items.length, json.items.length)

      var copy = new Receptacle(json)
      assert.equal(cache.id, copy.id)
      assert.equal(cache.items.length, copy.items.length)
    })
  })
})
