var utils = require('./utils')
var request = require('request')

function Transactions(url) {
  this.url = url
}

Transactions.prototype.get = function(txids, callback) {
  var uri = this.url + "raw/" +  txids.join(',')
  utils.makeRequest(uri, utils.handleJSend(function(data) {
    if(!Array.isArray(data)) data = [data]

    return data.map(function(tx) {
      return tx.tx.hex
    })
  }, callback))
}

Transactions.prototype.propagate = function(transactions, callback) {
  var waitingFor = transactions.length

  function waitForAll(err) {
    if (callback) {
      waitingFor--

      if (err) {
        callback(err)
        callback = undefined

      } else if (waitingFor === 0) {
        callback()
      }
    }
  }

  transactions.forEach(function(txHex) {
    request.post({
      url: this.url + 'push',
      json: true,
      form: {
        hex: txHex
      }
    }, utils.handleJSend(function() {
      return undefined
    }, waitForAll))
  }, this)
}

module.exports = Transactions
