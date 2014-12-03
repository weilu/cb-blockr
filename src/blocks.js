var assert = require('assert')
var async = require('async')
var bitcoinjs = require('bitcoinjs-lib')
var utils = require('./utils')

function Blocks(url, txEndpoint) {
  this.url = url
  this.txEndpoint = txEndpoint
}

Blocks.prototype.get = function(idsOrHeights, callback) {
  var uri = this.url + "raw/"
  var txEndpoint = this.txEndpoint

  utils.batchRequest(uri, idsOrHeights, function(err, data) {
    if(err) return callback(err)

    function parseBlock(b, cb) {
      var block = new bitcoinjs.Block()
      block.version = b.version
      block.prevHash = bitcoinjs.bufferutils.reverse(new Buffer(b.previousblockhash, 'hex'))
      block.merkleRoot = bitcoinjs.bufferutils.reverse(new Buffer(b.merkleroot, 'hex'))
      block.timestamp = b.time
      block.bits = parseInt(b.bits, 16)
      block.nonce = b.nonce

      txEndpoint.get(b.tx, function(err, transactions) {
        if(err) return cb(err)

        block.transactions = transactions.map(function(t) {
          return bitcoinjs.Transaction.fromHex(t.txHex)
        })

        cb(null, block.toHex())
      })
    }

    async.map(data, parseBlock, function(err, results) {
      callback(err, Array.isArray(idsOrHeights) ? results : results[0])
    })
  })
}

Blocks.prototype.latest = function(callback) {
  var uri = this.url + "raw/last/"

  utils.makeRequest(uri, function(err, data) {
    if(err) return callback(err)

    callback(null, {
      blockId: data.hash,
      prevBlockId: data.previousblockhash,
      merkleRootHash: data.merkleroot,
      nonce: data.nonce,
      version: data.version,
      blockHeight: data.height,
      blockSize: parseInt(data.bits, 16),
      timestamp: data.time,
      txCount: data.tx.length
    })
  })
}

Blocks.prototype.propagate = function() {
  assert(false, 'TODO')
}

Blocks.prototype.summary = function() {
  assert(false, 'TODO')
}

module.exports = Blocks
