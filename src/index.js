var Addresses = require('./addresses')
var Transactions = require('./transactions')

var NETWORKS = {
  testnet: "tbtc",
  bitcoin: "btc",
  litecoin: "ltc"
}

function Blockr(network) {
  network = network || 'bitcoin'
  var BASE_URL = 'https://' + NETWORKS[network] + '.blockr.io/api/v1/'

  // end points
  this.transactions = new Transactions(BASE_URL + 'tx/')
  this.addresses = new Addresses(BASE_URL + 'address/', this.transactions)
}

module.exports = Blockr
