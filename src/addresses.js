var utils = require('./utils')

function Addresses(url, txEndpoint) {
  this.url = url
  this.txEndpoint = txEndpoint
}

Addresses.prototype.get = function(addresses, callback) {
  var uri = this.url + "info/"

  utils.batchRequest(uri, addresses, function(err, data) {
    if(err) callback(err);

    var results = data.map(function(address) {
      return {
        address: address.address,
        balance: address.balance,
        totalReceived: address.totalreceived,
        txCount: address.nb_txs
      }
    })

    callback(null, results)
  })
}

Addresses.prototype.transactions = function(addresses, offset, callback) {
  if(offset > 0) {
    console.warn('Blockr API does not support offset for addresses.transactions')
  }

  var that = this
  var uri = this.url + "txs/"

  utils.batchRequest(uri, addresses, {params: ["confirmations=0"]}, function(err, data) {
    if(err) return callback(err)

    var txids = []
    data.map(function(address) {
      txids = txids.concat(address.txs.map(function(tx) { return tx.tx }))
    })

    that.txEndpoint.get(txids, callback)
  })
}

Addresses.prototype.unspents = function(addresses, offset, callback) {
  if(offset > 0) {
    console.warn('Blockr API does not support offset for addresses.unspents')
  }

  var uri = this.url + "unspent/"

  utils.batchRequest(uri, addresses, function(err, data) {

    var unspents = []
    data.forEach(function(result) {
      var address = result.address

      result.unspent.forEach(function(unspent) {
        unspent.address = address
      })

      unspents = unspents.concat(result.unspent)
    })

    var results = unspents.map(function(unspent) {
      return {
        address: unspent.address,
        confirmations: unspent.confirmations,
        index: unspent.n,
        txId: unspent.tx,
        value: unspent.amount
      }
    })

    callback(null, results)
  })
}

module.exports = Addresses
