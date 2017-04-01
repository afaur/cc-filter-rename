// -- I: `apple_tree`
// -- O: `0`
// -- R: {M}
const StripModeCheck = ({ ScanString: _SO }) => {
  // Determines mode number (M: _M) ( 1 - snakecase, 2 - camelcase )
  let _M = (_SO.indexOf('_') === -1) ? 0 : 1
  // Returns mode number (M: _M) ( 1 - snakecase, 2 - camelcase )
  return { M: _M }
}

// -- I: `{apple:1,grape:1}, /^apple/`
// -- O: `{apple:1}`
// -- R: {FK}
const FilteredKeys = ({ ScanObject: _SO, MatchRegex: _MR }) => {
  // Return new Array (_FK: FilteredKeys) by checking MatchRegex (_MR)
  let _FK = Object.keys( _SO ).filter( _K => !!_K.match( _MR ) )
  // Returns filtered keys (FK: _FK) that RegExp (_MR) matched
  return { FK: _FK }
}

// I: `someThingCamelCase`
// -- O: `4`
// -- R: {CI, KA}
const FindFirstUpper  = ({ ScanString: _S }) => {
  // Return new Array (_KA: KeyArray) from the ScanString (_S)
  let _KA = _S.split( '' )
  // Return position (_CI: CharIndex) of first upper case character
  let _CI = _KA.findIndex( _V => _V.toUpperCase() === _V )
  // No upper case character found
  if (_CI === -1) {
    // Throw helpful error message explaining the problem encountered
    throw new Error('Failed to find upper case character in a filtered key.')
  }
  // Return Position (_CI: CharIndex) and KeyArray (_KA)
  return { CI: _CI, KA: _KA }
}

// I: `someThingCamelCase`
// -- O: `somethingCamelCase`
// -- R: {F, C, L}
const LowerFirstUpper = ({ ScanString: _S }) => {
  // Get Position (CI) of first upper case char and KeyArray (KA)
  let { KA: _KA, CI: _CI } = FindFirstUpper({ ScanString: _S })
  // Return array of string parts (_C,_L) containing altered values
  let [ _C, _L ]  = [
    _KA[_CI].toLowerCase(), _KA.slice(_CI+1)
  ]
  // Return Character (_C), and LastPart (_L)
  return { C: _C, L: _L }
}

// I: `someThingCamelCase`
// -- O: `4`
// -- R: {CI, KA}
const FindFirstUnder  = ({ ScanString: _S }) => {
  // Return new Array (_KA: KeyArray) from the ScanString (_S)
  let _KA = _S.split( '' )
  // Return position (_CI: CharIndex) of first underscore character
  let _CI = _KA.findIndex( _V => '_' === _V )
  // No underscore character found
  if (_CI === -1) {
    // Throw helpful error message explaining the problem encountered
    throw new Error('Failed to find "_" character in a filtered key.')
  }
  // Return Position (_CI: CharIndex) and KeyArray (_KA)
  return { CI: _CI, KA: _KA }
}

// I: `some_thing_snake_case`
// -- O: `thing_snake_case`
// -- R: {F, C, L}
const StripFirstUnder = ({ ScanString: _S }) => {
  // Get Position (CI) of first upper case char and KeyArray (KA)
  let { KA: _KA, CI: _CI } = FindFirstUnder({ ScanString: _S })
  // Return array of string parts (_C,_L) containing altered values
  let [ _C, _L ]  = [
    '', _KA.slice(_CI+1)
  ]
  // Return Character (_C), and LastPart (_L)
  return { C: _C, L: _L }
}

const FilterRename = ( _P, { filter: _OF = /.+/, stripWords: _OS = 1 }, _M=[] ) => {
  // Store all of our new key names
  let _To = {}
  // Get all of our original key names
  let { FK: _FromKeys } = FilteredKeys({ ScanObject: _P, MatchRegex: _OF })
  // Iterate our original key names
  _FromKeys.forEach(( _K ) => {
    // Track the current key name
    let _CurrStr = _K
    // Determine if key uses snake or camelcase
    let { M: _Mode } = StripModeCheck({ ScanString: _CurrStr })
    // 1, snakecase, StripFirstUnder -- 0, camelcase, LowerFirstUpper
    let _Func = (_Mode === 1) ? StripFirstUnder : LowerFirstUpper
    // Iterate how many total words we need to remove
    for (let _W=1; _W<=_OS; _W++) {
      // Get the word parts of our transformed key (c=`char`, l=`last part`)
      let { C: _C, L: _L } = _Func({ ScanString: _CurrStr })
      // Place only the `char` and the `last part` into a new string
      _CurrStr = [_C,..._L].join('')
      // Continues looping to remove as many camelCase words as required
    }
    // Add modified key string with value at existing prop key on new object
    Object.assign( _To, { [_CurrStr]: _P[_K] } )
  })
  // Return the new object
  return _To
}

// --------------------------------------------------------------------
// FilterRename------------------------------------------------------
// --------------------------------------------------------------------
// Takes: _P: PropsObj, _O: Options
// --------------------------------------------------------------------
// -- PropsObj (object) contains some keys we want to rename.
// -- Options  (object) contains settings for how to transform props.
//   -- filter:     <RegEx>  -- Filter to pick keys we want to map.
//   -- stripWords: <Number> -- How many camelCase words to strip.
// --------------------------------------------------------------------
// Examples: Simple Example - filter objects keys
// --------------------------------------------------------------------
// FilterRename(
//   { foo: 1, bar: 2, baz: 3 },
//   { filter: /^ba/, stripWords: 0 }
// )
//  > { bar: 2, baz: 3 }
// --------------------------------------------------------------------
// Examples: Full Example - filter objects keys, and change key names
// --------------------------------------------------------------------
// FilterRename(
//   { someBarThing: 1, someFooThing: 2, moreFooThing: 3, theBar: 4 },
//   { filter: /^some/, stripWords: 1 }
// )
//  > { barThing: 2, fooThing: 2 }
// --------------------------------------------------------------------
module.exports = FilterRename
