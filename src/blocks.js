var utils = require('./utils')
var request = require('httpify')
var async = require('async')
var bitcoinjs = require('bitcoinjs-lib')

function Blocks(url) {
  this.url = url
}

Blocks.prototype.get = function(idsOrHeights, callback) {
  var uri = this.url + "raw/"

  utils.batchRequest(uri, idsOrHeights, function(err, data) {
    if(err) return callback(err)

    var results = data.map(function(b) {
      var block = new bitcoinjs.Block()
      block.version = b.version
      block.prevHash = bitcoinjs.bufferutils.reverse(new Buffer(b.previousblockhash, 'hex'))
      block.merkleRoot = bitcoinjs.bufferutils.reverse(new Buffer(b.merkleroot, 'hex'))
      block.timestamp = b.time
      block.bits = parseInt(b.bits, 16)
      block.nonce = b.nonce

      return block.toHex()
    })

    callback(null, results)
  })
}

Blocks.prototype.latest = function(callback) {
  var uri = this.url + "info/last/"

  utils.makeRequest(uri, function(err, data) {
    if(err) return callback(err)

    callback(null, {
      blockHash: data.hash,
      merkleRootHash: data.merkleroot,
      prevBlockHash: data.prev_block_hash,
      blockHeight: data.nb,
      blockTime: data.time_utc,
      blockSize: data.size,
      txCount: data.nb_txs
    })
  })
}

module.exports = Blocks
