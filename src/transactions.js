var utils = require('./utils')
var request = require('httpify')
var async = require('async')

function Transactions(url) {
  this.url = url
}

Transactions.prototype.summary = function(txids, callback) {
  var uri = this.url + "info/"

  utils.batchRequest(uri, txids, {params: ["output=hivewallet"]}, function(err, data) {
    if(err) return callback(err)

    var txs = data.map(function(d) {
      return {
        txId: d.tx,
        blockHash: d.blockhash,
        blockHeight: d.block,
        nInputs: d.vins.length,
        nOutputs: d.vouts.length,
        totalInputValue: -getTotalValue(d.vins),
        totalOutputValue: getTotalValue(d.vouts)
      }
    })

    callback(null, txs)
  })

  function getTotalValue(inputs) {
    if(inputs == null) return 0

    return inputs.reduce(function(memo, input) {
      return memo + parseInt(input.amount.replace('.', ''))
    }, 0)
  }
}

Transactions.prototype.get = function(txids, callback) {
  var uri = this.url + "raw/"

  utils.batchRequest(uri, txids, {params: ["output=hivewallet"]}, function(err, data) {
    if(err) return callback(err)

    var txs = data.map(function(d) {
      return {
        txId: d.tx.txid,
        txHex: d.tx.hex,
        blockHash: d.tx.blockhash,
        blockHeight: d.tx.blockheight,
        blockTimestamp: d.tx.blocktime,
        confirmations: d.tx.confirmations || 0
      }
    })
    callback(null, txs)
  })
}

Transactions.prototype.propagate = function(transactions, callback) {
  var that = this

  if(!Array.isArray(transactions)) {
    transactions = [transactions]
  }

  var requests = transactions.map(function(txHex) {
    return function(cb) {
      request({
        url: that.url + 'push',
        method: 'POST',
        type: 'json',
        form: {
          hex: txHex
        }
      }, utils.handleJSend(cb))
    }
  })

  async.parallel(requests, callback)
}

module.exports = Transactions
