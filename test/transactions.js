var assert = require('assert')
var bitcoinjs = require('bitcoinjs-lib')
var fixtures = require('./fixtures')
var request = require('superagent')

var Blockchain = require('../src/index.js')


function requestNewUnspents(amount, callback) {
  assert(amount > 0, 'Minimum amount is 1')
  assert(amount <= 3, 'Maximum amount is 3')
  amount = Math.round(amount)

  request
  .get('https://testnet.helloblock.io/v1/faucet?type=' + amount)
  .end(function(err, res) {
    if (err) return callback(err)

    var privKey = bitcoinjs.ECKey.fromWIF(res.body.data.privateKeyWIF)
    var txs = res.body.data.unspents.map(function(utxo) {
      var tx = new bitcoinjs.TransactionBuilder()
      tx.addInput(utxo.txHash, utxo.index)
      tx.addOutput(utxo.address, utxo.value)
      tx.sign(0, privKey)

      return tx.build().toHex()
    })

    var addresses = res.body.data.unspents.map(function(utxo) {
      return utxo.address
    })

    if (txs.length !== amount) return callback(new Error('txs.length !== amount'))

    callback(undefined, txs, addresses)
  })
}

describe('Transactions', function() {
  this.timeout(20000)

  var blockchain

  beforeEach(function() {
    blockchain = new Blockchain('testnet')
  })

  // describe('Summary', function() {
  //   function verify(f, result) {
  //     assert.equal(result.txId, f.txId)
  //     assert.equal(result.blockHash, f.blockHash)
  //     assert.equal(result.blockHeight, f.blockHeight)
  //     assert.equal(result.nInputs, f.nInputs)
  //     assert.equal(result.nOutputs, f.nOutputs)
  //     assert.equal(result.totalInputValue, f.totalInputValue)
  //     assert.equal(result.totalOutputValue, f.totalOutputValue)
  //   }
  //
  //   fixtures.transactions.forEach(function(f) {
  //     it('returns a summary for ' + f.txId + ' correctly', function(done) {
  //       blockchain.transactions.summary(f.txId, function(err, results) {
  //         assert.ifError(err)
  //
  //         results.forEach(function(result) {
  //           verify(f, result)
  //         })
  //
  //         done()
  //       })
  //     })
  //   })
  //
  //   it('works for n > 1 transactions', function(done) {
  //     var txIds = fixtures.transactions.map(function(f) { return f.txId })
  //
  //     blockchain.transactions.summary(txIds, function(err, results) {
  //       assert.ifError(err)
  //
  //       var resulttxIds = results.map(function(result) { return result.txId })
  //
  //       fixtures.transactions.forEach(function(f) {
  //         var i = resulttxIds.indexOf(f.txId)
  //
  //         verify(f, results[i])
  //       })
  //
  //       done()
  //     })
  //   })
  // })

  describe('Get', function() {
    fixtures.transactions.forEach(function(f) {
      it('returns the transaction for ' + f.txId + ' correctly', function(done) {
        blockchain.transactions.get(f.txId, function(err, results) {
          assert.ifError(err)

          results.forEach(function(result) {
            assert.equal(result.txId, f.txId)
            assert.equal(result.blockHash, f.blockHash)
            assert.equal(result.blockHeight, f.blockHeight)
            assert.equal(result.txHex, f.txHex)
            assert.equal(typeof result.confirmations, 'number')
            assert.equal(typeof result.blockTimestamp, 'number')
          })

          done()
        })
      })
    })

    it('works for n > 1 transactions', function(done) {
      var txIds = fixtures.transactions.map(function(f) { return f.txId })

      blockchain.transactions.get(txIds, function(err, results) {
        assert.ifError(err)

        assert.equal(results.length, fixtures.transactions.length)

        fixtures.transactions.forEach(function(f) {
          assert(results.some(function(result) {
            return (result.txId === f.txId) && (result.txHex === f.txHex)
          }))
        })

        done()
      })
    })
  })

  describe('Propagate', function() {
    it('propagates a single Transaction', function(done){
      requestNewUnspents(1, function(err, txs) {
        assert.ifError(err)

        blockchain.transactions.propagate(txs[0], function(err) {
          assert.ifError(err)

          done()
        })
      })
    })

    it('works for n > 1 transactions', function(done) {
      requestNewUnspents(3, function(err, txs) {
        assert.ifError(err)

        blockchain.transactions.propagate(txs, function(err) {
          assert.ifError(err)

          done()
        })
      })
    })
  })
})
