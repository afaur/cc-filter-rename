const test = require('ava')
const pm   = require('../lib/FilterRename.js')

// --------------------------------------------------------------------------
// Filter and strip one word - When filtered keys contain a capital letter
// --------------------------------------------------------------------------
test(t => {
  // Setup
  let props = {
    someBarThing: 1, someFooThing: 2, moreFooThing: 3, theBar: 4
  }
  // Call
  let newProps = pm(
    props, { filter: /^some/, stripWords: 1 }
  )
  // Check
  t.deepEqual( newProps, { barThing: 1, fooThing: 2 } )
})
// --------------------------------------------------------------------------


// --------------------------------------------------------------------------
// Filter and strip one word - When a filtered key has no capital letter
// --------------------------------------------------------------------------
test('throws', t => {
  let err = t.throws(
    () => {
      // Setup
      let props = {
        someBarThing: 1, somea: 2, moreFooThing: 3, theBar: 4
      }
      // Call should throw
      let newProps = pm(
        props, { filter: /^some/, stripWords: 1 }
      )
    }, Error
  )
  let msg = err.message
  t.is( msg, 'Failed to find upper case character in a filtered key.' )
})
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Filter and strip one word - When a filtered key uses snake case
// --------------------------------------------------------------------------
test(t => {
  // Setup
  let props = {
    SOCKETCLUSTER_WORKER_CONTROLLER: 1,
    SOCKETCLUSTER_BROKER_CONTROLLER: 2,
    SOCKETCLUSTER_INIT_CONTROLLER: 3
  }
  // Call
  let newProps = pm(
    props, { filter: /^SOCKETCLUSTER/, stripWords: 1 }
  )
  // Check
  t.deepEqual( newProps, {
    WORKER_CONTROLLER: 1,
    BROKER_CONTROLLER: 2,
    INIT_CONTROLLER: 3
  })
})
// --------------------------------------------------------------------------
