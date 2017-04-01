const test = require('ava')
const pm   = require('../lib/CCFilterRename.js')

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
      // Call
      let newProps = pm(
        props, { filter: /^some/, stripWords: 1 }
      )
      // Check
      pm( props, { filter: /^some/, stripWords: 1 })
    }, Error
  )
  let msg = err.message
  t.is( msg, 'Failed to find upper case character in a filtered key.' )
})
// --------------------------------------------------------------------------
