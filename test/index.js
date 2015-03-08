var assert = require('assert')
var request = require('httpify')
var mockery = require('mockery')
var Blockchain = require('../src/index')

var proxyURL = 'https://hive-proxy.herokuapp.com/?url='

describe('Blockchain', function() {
  describe('Constructor', function() {
    it('defaults to the bitcoin network', function() {
      var blockchain = new Blockchain()

      assert.equal(blockchain.getNetwork(), 'bitcoin')
    })

    it('allows a proxyURL to be passed in as the 2nd argument', function() {
      var blockchain = new Blockchain('testnet', proxyURL)
      assert.equal(blockchain.getProxyURL(), proxyURL)
    })
  })

  describe('getNetwork', function() {
    it('returns the underlying network name', function() {
      var blockchain = new Blockchain('testnet')

      assert.equal(blockchain.getNetwork(), 'testnet')
    })

    it('throws on unknown network', function() {
      assert.throws(function() {
        new Blockchain('zoigberg')
      }, /Unknown network: zoigberg/)
    })
  })
})

describe('cb-tests', function() {
  var options = {}

  beforeEach(function() {
    options.blockchain = new Blockchain('testnet')
  })

  require('cb-tester')(options)
})

describe('cb-tests with proxy', function() {
  var options = {}

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    })

    mockery.registerMock('httpify', function(options, callback) {
      if(options.url && options.url.indexOf("https://tbtc.blockr.io/api/") === 0) {
        assert.fail(options.uri, proxyURL, "Expect proxy URL used for request, but currently requesting blockr API directly")
      } else {
        request.apply(null, arguments)
      }
    })

    Blockchain = require('../src/index')
  })

  beforeEach(function() {
    options.blockchain = new Blockchain('testnet', proxyURL)
  })

  after(function() {
    mockery.deregisterAll()
    mockery.disable()
  })

  require('cb-tester')(options)
})

