var assert = require('assert')
var request = require('request')

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

function handleJSendAsync(handle, callback) {
  return function(err, response, body) {
    if (err) return callback(err)

    var result
    try {
      assertJSend(body)
    } catch (exception) {
      return callback(exception)
    }

    handle(body.data, callback)
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

module.exports = {
  handleJSend: handleJSend,
  handleJSendAsync: handleJSendAsync,
  makeRequest: makeRequest
}
