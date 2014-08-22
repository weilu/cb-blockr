var assert = require('assert')
var bitcoinjs = require('bitcoinjs-lib')
var fixtures = require('./fixtures').testnet
var request = require('request')

var Blockchain = require('../src/index.js')

describe('Blockchain API', function() {
  this.timeout(8000)

  var blockchain

  beforeEach(function() {
    blockchain = new Blockchain('testnet')
  })

  describe('Addresses', function() {
    describe('Get', function() {
      fixtures.addresses.forEach(function(f) {
        it('returns summary for ' + f + ' correctly', function(done) {
          blockchain.addresses.get(f, function(err, results) {
            assert.ifError(err)

            results.forEach(function(result) {
              assert(result.address, f)
              assert(result.balance > 0)
              assert(result.totalReceived > 0)
              assert(result.txCount > 0)
            })

            done()
          })
        })
      })

      it('works when there are many addresses', function(done) {
        var addresses = fixtures.addresses.concat(fixtures.more_addresses).concat(fixtures.even_more_addresses)
        blockchain.addresses.get(addresses, function(err, results) {
          assert.ifError(err)

          assert.equal(results.length, addresses.length)
          done()
        })
      })
    })

    describe('Transactions', function() {
      it('returns sane results', function(done) {
        blockchain.addresses.transactions(fixtures.addresses[0], 0, function(err, results) {
          assert.ifError(err)

          results.forEach(function(result) {
            assert(result.hex.match(/^[0-9a-f]+$/i))
            assert(result.hex.length >= 20)
            assert.equal(typeof result.confirmations, 'number')
          })

          done()
        })
      })

      it('returns expected transactions', function(done) {
        var hexs = fixtures.transactions.map(function(f) { return f.hex })

        blockchain.addresses.transactions(fixtures.addresses, 0, function(err, results) {
          assert.ifError(err)

          var actualHexs = results.map(function(tx) { return tx.hex })
          hexs.forEach(function(hex) {
            assert.notEqual(actualHexs.indexOf(hex), -1, hex + ' not found')
          })

          done()
        })
      })

      it('works when there are many addresses', function(done) {
        var addresses = fixtures.addresses.concat(fixtures.more_addresses).concat(fixtures.even_more_addresses)
        blockchain.addresses.transactions(addresses, 0, function(err, results) {
          assert.ifError(err)
          done()
        })
      })

      it('works when there are many transactions', function(done) {
        blockchain.addresses.transactions(fixtures.addresses.concat(fixtures.more_addresses), 0, function(err, results) {
          assert.ifError(err)
          done()
        })
      })
    })

    describe('Unspents', function() {
      it('returns sane results', function(done) {
        var txids = fixtures.transactions.map(function(f) { return f.txid })

        blockchain.addresses.unspents(fixtures.addresses[0], 0, function(err, results) {
          assert.ifError(err)

          results.forEach(function(result) {
            assert(result.confirmations > 0)
            assert(result.index >= 0)
            assert(result.txId.length === 64)
            assert(result.value > 0)
            assert.doesNotThrow(function() {
              bitcoinjs.Address.fromBase58Check(result.address)
            })
          })

          done()
        })
      })

      it('returns expected transactions', function(done) {
        var txids = fixtures.transactions.map(function(f) { return f.txid })

        blockchain.addresses.unspents(fixtures.addresses, 0, function(err, results) {
          assert.ifError(err)

          var resultTxids = results.map(function(result) { return result.txId })

          txids.forEach(function(txid) {
            assert.notEqual(resultTxids.indexOf(txid), -1, txid + ' not found')
          })

          done()
        })
      })

      it('works when there are many addresses', function(done) {
        var addresses = fixtures.addresses.concat(fixtures.more_addresses).concat(fixtures.even_more_addresses)
        blockchain.addresses.unspents(addresses, 0, function(err, results) {
          assert.ifError(err)
          done()
        })
      })
    })
  })

  describe('Transactions', function() {
    describe('Get', function() {
      fixtures.transactions.forEach(function(f) {
        it('returns and parses ' + f.txid + ' correctly', function(done) {
          blockchain.transactions.get(f.txid, function(err, results) {
            assert.ifError(err)

            results.forEach(function(result) {
              assert.equal(result.hex, f.hex)
              assert.equal(typeof result.confirmations, 'number')
            })

            done()
          })
        })
      })

      it('supports n > 1 batch sizes', function(done) {
        var txids = fixtures.transactions.map(function(f) { return f.txid })

        blockchain.transactions.get(txids, function(err, results) {
          assert.ifError(err)

          assert.equal(results.length, fixtures.transactions.length)

          var actualHexs = results.map(function(tx) { return tx.hex })
          fixtures.transactions.forEach(function(expected) {
            assert.notEqual(actualHexs.indexOf(expected.hex), -1, expected.hex + ' not found')
          })

          done()
        })
      })
    })

    describe('Propagate', function() {
      it('propagates a single Transaction', function(done){
        createTxsFromUnspents(1, function(txs) {
          blockchain.transactions.propagate(txs[0], function(err) {
            assert.ifError(err)
            done()
          })
        })
      })

      it('supports n > 1 batch sizes', function(done) {
        createTxsFromUnspents(3, function(txs) {
          blockchain.transactions.propagate(txs, function(err) {
            assert.ifError(err)
            done()
          })
        })
      })

      function createTxsFromUnspents(n, callback) {
        request.get({
          url: "https://testnet.helloblock.io/v1/faucet?type=" + n,
          json: true
        }, function(err, res, body) {
          assert.ifError(err)

          var unspents = body.data.unspents
          assert.equal(unspents.length, n)

          var wif = body.data.privateKeyWIF
          var privKey = bitcoinjs.ECKey.fromWIF(wif)

          var txs = unspents.map(function(utxo) {
            var tx = new bitcoinjs.Transaction()
            tx.addInput(utxo.txHash, utxo.index)
            tx.addOutput(utxo.address, utxo.value)
            tx.sign(0, privKey)
            return tx.toHex()
          })

          callback(txs)
        })
      }
    })
  })
})
