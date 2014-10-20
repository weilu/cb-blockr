var assert = require('assert')
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
  describe('Get', function() {})
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
