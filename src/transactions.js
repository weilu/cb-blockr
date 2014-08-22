var utils = require('./utils')
var request = require('request')
var async = require('async')

function Transactions(url) {
  this.url = url
  this.perBatchLimit = 20
}

Transactions.prototype.get = function(txids, callback) {
  var uri = this.url + "raw/"

  utils.batchRequest(uri, txids, this.perBatchLimit, function(err, data) {
    if(err) return callback(err)

    var txs = data.map(function(tx) {
      return { hex: tx.tx.hex, confirmations: tx.tx.confirmations }
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
      request.post({
        url: that.url + 'push',
        json: true,
        form: {
          hex: txHex
        }
      }, utils.handleJSend(cb))
    }
  })

  async.parallel(requests, callback)
}

module.exports = Transactions
