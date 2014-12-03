var assert = require('assert')
var Blockchain = require('../src/index')

describe('Blockchain', function() {
  describe('Constructor', function() {
    it('defaults to the bitcoin network', function() {
      var blockchain = new Blockchain()

      assert.equal(blockchain.getNetwork(), 'bitcoin')
    })
  })

  describe('getNetwork', function() {
    it('returns the underlying network name', function() {
      var blockchain = new Blockchain('testnet')

      assert.equal(blockchain.getNetwork(), 'testnet')
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
