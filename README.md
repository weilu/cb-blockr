cb-blockr
=========

[![Build Status](https://travis-ci.org/weilu/cb-blockr.png?branch=master)](https://travis-ci.org/weilu/cb-blockr)
[![Version](http://img.shields.io/npm/v/cb-blockr.svg)](https://www.npmjs.org/package/cb-blockr)

## Usage

```javascript
var Blockchain = require('cb-blockr')
var blockchain = new Blockchain('testnet')

// helper function
function printTxInfo(err, transactions) {
  if(err) return console.error(err.stack)
  console.log(transactions)
}

// get transactions of an address
blockchain.addresses.transactions('mijTkG8nYpN57CZNPqmGUZamqyspoxtxd4', 0, printTxInfo)

// get transactions of multiple addresses
blockchain.addresses.transactions(['mijTkG8nYpN57CZNPqmGUZamqyspoxtxd4', 'mxzhFsPcF8ujAJ7CxLtvxLLoZqJtkGD5e4'], 0, printTxInfo)

// get transactions
blockchain.transactions.get([
  'd37d8d34bb0a5e309fc365da1d860d2fc13131f3d8955dcaec89bf502e58f23b',
  '43de8af6b31f996df522fc3489c4474fb918135a15ff4dbc04f551b4e79e2683'
], printTxInfo)

// get unspents
blockchain.addresses.unspents('mijTkG8nYpN57CZNPqmGUZamqyspoxtxd4', function(err, unspents) {
  console.log(unspents)
})
```

## See also

- [Common blockchain](https://github.com/dcousens/common-blockchain)
- [Common blockchain wrapper for helloblock.io](https://github.com/dcousens/cb-helloblock)
