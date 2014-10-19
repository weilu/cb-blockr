cb-blockr
=========

[![Build Status](https://travis-ci.org/weilu/cb-blockr.png?branch=master)](https://travis-ci.org/weilu/cb-blockr)

[![browser support](https://ci.testling.com/weilu/cb-blockr.png)
](https://ci.testling.com/weilu/cb-blockr)

Common blockchain wrapper for blockr.io

## API

### Addresses

#### Addresses.Summary

**Parameters**: Array of addresses

``` javascript
[
  {
    address: "mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY",
    balance: 100000,
    totalReceived: 430000,
    txCount: 3
  },
  ...
]
```


#### Addresses.Transactions

**Parameters**: Array of addresses

Returns a array of transactions related to this Address (as an input or output).

``` javascript
[
  {
    txId: "c7736a0a0046d5a8cc61c8c3c2821d4d7517f5de2bc66a966011aaa79965ffba",
    txHex: "01000000011c1020c1114820e7c44e12e804aec5f4af1e8a6aad3c446c4cfc8aa53e61f73d010000008a47304402200fea124cecd36e92cb0b549b62740a26f374629b26f16292a3e858753035172802205ba172966addddbbe8181af6cd7fb6e9c53414fb6727c4f15589c74567e48ab30141040cfa3dfb357bdff37c8748c7771e173453da5d7caa32972ab2f5c888fff5bbaeb5fc812b473bf808206930fade81ef4e373e60039886b51022ce68902d96ef70ffffffff02204e0000000000001976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388acabfb423d000000001976a91461b469ada61f37c620010912a9d5d56646015f1688ac00000000",
    blockHash: "00000000000000001b701ecd0cf2b7a7742a320e9a06a506227ee345b5735d13",
    blockHeight: 318573,
    blockTimestamp: 1413748000,
    confirmations: 2
  },
  ...
]
```


#### Addresses.Unspents

**Parameters:** Array of addresses

Returns a array of transaction summaries combined with the vout, value and related address.

``` javascript
[
  {
    txId: "c7736a0a0046d5a8cc61c8c3c2821d4d7517f5de2bc66a966011aaa79965ffba",
    confirmations: 6,
    address: "mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY",
    value: 430000,
    vout: 0
  },
  ...
]
```


### Transactions

#### Transactions.Summary

**Parameters:** Array of Transaction ids (big-endian transaction hashes)

``` javascript
[
  {
    txId: "c7736a0a0046d5a8cc61c8c3c2821d4d7517f5de2bc66a966011aaa79965ffba",
    blockHash: "00000000000000001b701ecd0cf2b7a7742a320e9a06a506227ee345b5735d13",
    blockHeight: 318573,
    nInputs: 2,
    nOutputs: 7,
    totalInputValue: 130000,
    totalOutputValue: 100000
  },
  ...
]
```


#### Transactions.Get

**Parameters:** Array of transaction ids (big-endian transaction hashes)

``` javascript
[
  {
    txId: "c7736a0a0046d5a8cc61c8c3c2821d4d7517f5de2bc66a966011aaa79965ffba",
    txHex: "01000000011c1020c1114820e7c44e12e804aec5f4af1e8a6aad3c446c4cfc8aa53e61f73d010000008a47304402200fea124cecd36e92cb0b549b62740a26f374629b26f16292a3e858753035172802205ba172966addddbbe8181af6cd7fb6e9c53414fb6727c4f15589c74567e48ab30141040cfa3dfb357bdff37c8748c7771e173453da5d7caa32972ab2f5c888fff5bbaeb5fc812b473bf808206930fade81ef4e373e60039886b51022ce68902d96ef70ffffffff02204e0000000000001976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388acabfb423d000000001976a91461b469ada61f37c620010912a9d5d56646015f1688ac00000000",
    blockHash: "00000000000000001b701ecd0cf2b7a7742a320e9a06a506227ee345b5735d13",
    blockHeight: 318573,
    blockTimestamp: 1413748000,
    confirmations: 2
  },
  ...
]
```


#### Transactions.Propagate

**Parameters:** Array of transaction hex strings in the bitcoin protocol format.

``` javascript
No response body
```


### Blocks

#### Blocks.Summary (TODO)

**Parameters:** Array of block hashs and/or block heights

``` javascript
[
  {
    blockHash: "00000000000000001b701ecd0cf2b7a7742a320e9a06a506227ee345b5735d13",
    merkleRootHash: "82203172bab3f9b90543e98eef4acdf5ab9daf3b6df80806092f9715fe72ba63",
    prevBlockHash: "000000000025896a3409c57493aa7020a4cc24232a8ee9da10cbe857953d27bd",
    nonce: 4210027488,
    blockHeight: 318573,
    blockTime: 1382046624,
    blockSize: 456643328,
    txCount: 3
  }
]
```


#### Blocks.Get (TODO)

**Parameters:** Array of block hashs and/or block heights

``` javascript
[
  "020000003bef0d0b88737698572aa5c78 ... much hex",
  ...
]
```


#### Blocks.Latest

Returns the latest block (subjective to the node)

``` javascript
{
  blockHash: "00000000000000001b701ecd0cf2b7a7742a320e9a06a506227ee345b5735d13",
  merkleRootHash: "82203172bab3f9b90543e98eef4acdf5ab9daf3b6df80806092f9715fe72ba63",
  prevBlockHash: "000000000025896a3409c57493aa7020a4cc24232a8ee9da10cbe857953d27bd",
  nonce: 4210027488, // TODO
  blockHeight: 318573,
  blockTime: 1382046624,
  blockSize: 456643328,
  txCount: 3
}
```


#### Blocks.Propagate (TODO)

**Parameters:** Block hex

``` javascript
No response body
```


#### Blocks.Transactions (TODO)

**Parameters:** Array of block hashs and/or block heights

Returns a array of transaction summaries for each transaction in the block(s).

``` javascript
[
  {
    txId: "c7736a0a0046d5a8cc61c8c3c2821d4d7517f5de2bc66a966011aaa79965ffba",
    blockHash: "00000000000000001b701ecd0cf2b7a7742a320e9a06a506227ee345b5735d13",
    blockHeight: 318573
  },
  ...
]
```

## See also

- [Common blockchain](https://github.com/dcousens/common-blockchain)
- [Common blockchain wrapper for helloblock.io](https://github.com/dcousens/cb-helloblock)

