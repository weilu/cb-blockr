var utils = require('./utils')

function Addresses(url, txEndpoint) {
  this.url = url
  this.txEndpoint = txEndpoint
  this.perBatchLimit = 19
}

Addresses.prototype.get = function(addresses, callback) {
  var uri = this.url + "info/"

  utils.batchRequest(uri, addresses, this.perBatchLimit, function(err, data) {
    if(err) callback(err);

    if(!Array.isArray(data)) data = [data];

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

  utils.batchRequest(uri, addresses, this.perBatchLimit, function(err, data) {
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

  utils.makeRequest(this.url + "unspent/" + addresses.join(','), utils.handleJSend(function(data) {

    if(!Array.isArray(data)) data = [data]

    var unspents = []
    data.forEach(function(address) {
      unspents = unspents.concat(address.unspent)
    })

    return unspents.map(function(unspent) {
      return {
        confirmations: unspent.confirmations,
        index: unspent.n,
        script: unspent.script,
        txId: unspent.tx,
        value: unspent.amount
      }
    })
  }, callback))
}

module.exports = Addresses
