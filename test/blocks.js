var assert = require('assert')
var bitcoinjs = require('bitcoinjs-lib')
var fixtures = require('./fixtures')
var request = require('superagent')

var Blockchain = require('../src/index.js')

describe('Blocks', function() {
  this.timeout(20000)

  var blockchain

  beforeEach(function() {
    blockchain = new Blockchain('testnet')
  })

  describe('Summary', function() {})

  describe('Get', function() {
    var expectedHex = "020000003385c4b2a3499669987f5d04fa4127b59dbf2ee625694fa0bf08000000000000cf52f0ed6571367818a801a169e64030d8cab1a9f17e27170a6924127e19dbb8eba43e54ffff001d12052ce00101000000010000000000000000000000000000000000000000000000000000000000000000ffffffff2403089904174b6e434d696e65724251521defe5cdcf04ad543ea4eb0101000000165e0000ffffffff0100f90295000000001976a9149e8985f82bc4e0f753d0492aa8d11cc39925774088ac00000000"

    it('allows query with block height', function(done) {
      blockchain.blocks.get(301320, function(err, result) {
        assert.ifError(err)

        assert.equal(result[0], expectedHex)
        done()
      })
    })

    it('allows query with block id', function(done) {
      blockchain.blocks.get("000000006c840ca5ff4dadcfeb4fe14b3d90c144be0fe5b8d06b329b8f8f3855", function(err, result) {
        assert.ifError(err)

        assert.equal(result[0], expectedHex)
        done()
      })
    })
  })

  describe('Latest', function() {
    it('returns sane results', function(done) {
      blockchain.blocks.latest(function(err, result) {
        assert.ifError(err)

        // TODO: more intricate sanity checking
        assert(result.blockHash.match(/^[0-9a-f]+$/i))
        assert.equal(result.blockHash.length, 64)
        assert(result.blockHeight > 0)

        done()
      })
    })
  })
  describe('Propagate', function() {})
  describe('Transactions', function() {})
})
