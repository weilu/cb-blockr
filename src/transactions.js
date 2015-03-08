var async = require('async')
var utils = require('./utils')

function Transactions(url) {
  this.url = url
}

Transactions.prototype.summary = function(txIds, callback) {
  var uri = this.url + "info/"

  utils.batchRequest(uri, txIds, {params: ["output=hivewallet"]}, function(err, data) {
    if(err) return callback(err)

    var results = data.map(function(d) {
      return {
        txId: d.tx,
        blockId: d.blockhash,
        blockHeight: d.block,
        nInputs: d.vins.length,
        nOutputs: d.vouts.length,
        totalInputValue: -getTotalValue(d.vins),
        totalOutputValue: getTotalValue(d.vouts)
      }
    })

    callback(null, Array.isArray(txIds) ? results : results[0])
  })

  function getTotalValue(inputs) {
    if (!inputs) return 0

    return inputs.reduce(function(memo, input) {
      return memo + Math.round(input.amount * 1e8)
    }, 0)
  }
}

Transactions.prototype.get = function(txIds, callback) {
  var uri = this.url + "raw/"

  var queryTxIds = [].concat(txIds)
  utils.batchRequest(uri, queryTxIds, {params: ["output=hivewallet"]}, function(err, data) {
    if (err) return callback(err)

    var results = data.map(function(d, i) {
      return {
        txId: queryTxIds[i],
        txHex: d.tx.hex,
        blockId: d.tx.blockhash,
        blockHeight: d.tx.blockheight,

        // non-standard
        __blockTimestamp: d.tx.blocktime,
        __confirmations: d.tx.confirmations || 0
      }
    })

    callback(null, Array.isArray(txIds) ? results : results[0])
  })
}

Transactions.prototype.propagate = function(transactions, callback) {
  var that = this

  if(!Array.isArray(transactions)) {
    transactions = [transactions]
  }

  var requests = transactions.map(function(txHex) {
    return function(cb) {
      utils.makePostRequest(that.url + 'push', { hex: txHex }, cb)
    }
  })

  async.parallel(requests, callback)
}

module.exports = Transactions
