var utils = require('./utils')
var request = require('request')
var async = require('async')

function Transactions(url) {
  this.url = url
}

Transactions.prototype.get = function(txids, callback) {
  var uri = this.url + "raw/"

  utils.batchRequest(uri, txids, 19, function(err, data) {
    if(err) return callback(err)

    var txs = data.map(function(tx) { return tx.tx.hex })
    callback(null, txs)
  })
}

Transactions.prototype.propagate = function(transactions, callback) {
  var noop = function() { return undefined }
  var that = this

  var requests = transactions.map(function(txHex) {
    return function(cb) {
      request.post({
        url: that.url + 'push',
        json: true,
        form: {
          hex: txHex
        }
      }, utils.handleJSend(noop, cb))
    }
  })

  async.parallel(requests, callback)
}

module.exports = Transactions
