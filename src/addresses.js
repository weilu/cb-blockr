var async = require('async')
var utils = require('./utils')
var bitcoinjs = require('bitcoinjs-lib')

function Addresses(url, txEndpoint) {
  this.url = url
  this.txEndpoint = txEndpoint
}

Addresses.prototype.summary = function(addresses, callback) {
  var uri = this.url + "info/"

  validateAddresses(addresses, function(err) {
    if(err) return callback(err)

    utils.batchRequest(uri, addresses, {params: ["confirmations=0"]}, function(err, data) {
      if(err) return callback(err);

      var results = data.map(function(address) {
        return {
          address: address.address,
          balance: address.balance,
          totalReceived: address.totalreceived,
          txCount: address.nb_txs
        }
      })

      callback(null, Array.isArray(addresses) ? results : results[0])
    })
  })
}

Addresses.prototype.transactions = function(addresses, blockHeight, done) {
  // optional blockHeight
  if ('function' === typeof blockHeight) {
    done = blockHeight
    blockHeight = 0
  }

  if (blockHeight > 0) {
    console.warn('Blockr API does not support blockHeight filter for addresses.transactions')
  }

  var url = this.url
  var txIds = {}

  var self = this
  validateAddresses(addresses, function(err) {
    if(err) return done(err)

    async.parallel([
      // confirmed transactions
      function(callback) {
        utils.batchRequest(url + 'txs/', addresses, {params: ["confirmations=0"]}, function(err, data) {
          if (err) return callback(err)

          data.forEach(function(address) {
            address.txs.forEach(function(tx) {
              txIds[tx.tx] = true
            })
          })

          callback()
        })
      },

      // unconfirmed (FIXME: remove if they ever fix their API)
      function(callback) {
        utils.batchRequest(url + 'unconfirmed/', addresses, {}, function(err, data) {
          if (err) return callback(err)

          data.forEach(function(address) {
            address.unconfirmed.forEach(function(tx) {
              txIds[tx.tx] = true
            })
          })

          callback()
        })
      }
    ], function(err) {
      if (err) return done(err)

      self.txEndpoint.get(Object.keys(txIds), done)
    })
  })
}

Addresses.prototype.unspents = function(addresses, callback) {
  var uri = this.url + "unspent/"

  validateAddresses(addresses, function(err) {
    if(err) return callback(err)

    utils.batchRequest(uri, addresses, {params: ["unconfirmed=1"]}, function(err, data) {
      if (err) return callback(err)

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
          vout: unspent.n,
          txId: unspent.tx,
          value: unspent.amount
        }
      })

      callback(null, results)
    })
  })
}

function validateAddresses(addresses, callback) {
  addresses = [].concat(addresses)
  var invalidAddresses = addresses.filter(function(address) {
    try {
      bitcoinjs.Address.fromBase58Check(address)
    } catch(e) {
      return true
    }
  })

  if(invalidAddresses.length > 0) {
    return callback(new Error("There are " + invalidAddresses.length + " invalid addresses: " + invalidAddresses.join(', ')))
  }

  callback(null)
}

module.exports = Addresses
