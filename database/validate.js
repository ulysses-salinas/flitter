const assert = require('assert')

function validTweet (s) {
  return typeof s === 'string' &&
         s !== '' &&
         s.length < 1000
}

assert(validTweet('foo'))
assert(!validTweet(''))
assert(!validTweet())
assert(!validTweet(null))
assert(!validTweet({}))

// -----------------------------------------------------------------------------
// Public API

module.exports = {
  validTweet: validTweet
}