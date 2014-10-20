var utils = require('./utils')
var request = require('httpify')
var async = require('async')

function Blocks(url) {
  this.url = url
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
