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
    it('returns sane results', function(done) {
      blockchain.blocks.get(301320, function(err, result) {
        assert.ifError(err)

        var block = bitcoinjs.Block.fromHex(result[0])

        assert.equal(block.version, 2)
        assert.equal(block.prevHash.toString('hex'), "3385c4b2a3499669987f5d04fa4127b59dbf2ee625694fa0bf08000000000000")
        assert.equal(block.merkleRoot.toString('hex'), "cf52f0ed6571367818a801a169e64030d8cab1a9f17e27170a6924127e19dbb8")
        assert.equal(block.timestamp, 1413391595)
        assert.equal(block.bits, 486604799)
        assert.equal(block.nonce, 3760981266)

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
