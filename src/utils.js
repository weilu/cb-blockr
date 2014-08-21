var assert = require('assert')
var request = require('request')
var async = require('async')

function assertJSend(body) {
  assert.notEqual(body.status, 'error', body.message || 'Invalid JSend response:' + JSON.stringify(body))
  assert.notEqual(body.status, 'fail', body.data || 'Invalid JSend response: ' + JSON.stringify(body))

  assert.equal(body.status, 'success', 'Unexpected JSend response: ' + body)
  assert.notEqual(body.data, undefined, 'Unexpected JSend response: ' + body)
}

function handleJSend(handle, callback) {
  return function(err, response, body) {
    if (err) return callback(err)

    var result
    try {
      assertJSend(body)

      result = handle(body.data)
    } catch (exception) {
      return callback(exception)
    }

    callback(undefined, result)
  }
}

function handleJSendAsync(callback) {
  return function(err, response, body) {
    if (err) return callback(err)

    var result
    try {
      assertJSend(body)
    } catch (exception) {
      return callback(exception)
    }

    callback(null, body.data)
  }
}

function makeRequest(uri, params, callback){
  if(Array.isArray(params)){
    uri +=  '?' + params.join('&')
  } else if (params instanceof Function) {
    callback = params
  }

  request.get({
    uri: uri,
    json: true
  }, callback)
}

function batchRequest(uri, items, itemsPerBatch, callback) {
  items = items.slice() // do not modify items
  var batches = []

  while(items.length > itemsPerBatch){
    var batch = items.splice(0, itemsPerBatch)
    batches.push(batch)
  }

  if(items.length > 0) batches.push(items)


  var requests = batches.map(function(batch) {
    return function(cb) {
      makeRequest(uri + batch.join(','), handleJSendAsync(cb))
    }
  })

  var consolidated = []
  async.parallel(requests, function(err, results) {
    if(err) return callback(err)

    results.forEach(function(r) {
      consolidated = consolidated.concat(r)
    })

    callback(null, consolidated)
  })
}

module.exports = {
  handleJSend: handleJSend,
  handleJSendAsync: handleJSendAsync,
  makeRequest: makeRequest,
  batchRequest: batchRequest
}
