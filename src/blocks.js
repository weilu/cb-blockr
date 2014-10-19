var utils = require('./utils')
var request = require('httpify')
var async = require('async')

function Blocks(url) {
  this.url = url
}

Blocks.prototype.latest = function(count, callback) {
  // optional count
  if ('function' === typeof count) {
    callback = count
    count = 1
  }

  if(count !== 1) {
    return callback(new Error('Blockr API does not support count'))
  }

  var uri = this.url + "info/last/"

  utils.makeRequest(uri, function(err, data) {
    if(err) return callback(err)

    callback(null, [{
      blockHash: data.hash,
      merkleRootHash: data.merkleroot,
      prevBlockHash: data.prev_block_hash,
      blockHeight: data.nb,
      blockTime: data.time_utc,
      blockSize: data.size,
      txCount: data.nb_txs
    }])
  })
}

module.exports = Blocks
