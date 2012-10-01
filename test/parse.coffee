
script = require "factor_script"
assert = require 'assert'
helpers = require "factor_script/lib/test/default"

str = helpers.str

describe "Parse", () ->

  it "returns an array", () ->
    s = new script.New """
      One is: 1
    """
    result = s.parse()
    assert.deepEqual result, ["One", "is:", "1"]

describe "Parse Strings", () ->
  
  it "keeps strings together", () ->
    s = new script.New """
      One is: "This sentence."
    """
    result = s.parse()
    assert.deepEqual result, ["One", "is:", str("This sentence.")]

  it 'escapes quotation marks with ^" and "^', () ->
    s = new script.New """
      Var is: "This sentence with ^"start and end!"^"
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", str 'This sentence with "start and end!"']

  it 'escapes escaped quotation marks with ^^" and "^^', () ->
    s = new script.New """
      Var is: "This sentence with ^^"start and end!"^^"
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", str 'This sentence with ^"start and end!"^']

describe "Parse ( )", () ->

  it "separates ( ) as a Hash", () ->
    s = new script.New """
      Var is: ( 1 2 3 )
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], start: '(', end: ')' } ]

describe "Parse { }", () ->

  it "separates { } as a Hash", () ->
    s = new script.New """
      Var is: { 1 2 3 }
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], start: '{', end: '}' } ]

describe 'Parse #{ }', () ->

  it 'separates #{ } as a Hash', () ->
    s = new script.New ' Var is: #{ 1 2 3 } '
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], start: '#{', end: '}' } ]

describe "Parse w{ }", () ->

  it "separates w{ } as a Hash", () ->
    s = new script.New """
      Var is: w{ 1 2 3 }
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], start: 'w{', end: '}' } ]
    
    
    
describe "Parse nesting blocks", () ->
    
  it "separates nested ( { } ) as a Hash", () ->
    s = new script.New """
      Var is:  ( { 1 2 3 } { 4 5 6 } )
    """
    result = s.parse()
    target = [ 
      "Var", 
      "is:", 
      {
        values: [ 
          {values: ["1", "2", "3"], start: "{", end: '}'},
          {values: ["4", "5", "6"], start: "{", end: '}'} ]
        start: '('
        end: ')'
      } 
    ]
    assert.deepEqual result, target
    
  it 'separates nested ( { } #{ w{ } } ) as a Hash', () ->
    s = new script.New ' Var is:  ( { 1 2 3 } #{ 4 w{ O is: 1 } 5 6 } ) '
    result = s.parse()
    target = [ 
      "Var", 
      "is:", 
      {
        values: [ 
          {values: ["1", "2", "3"], start: "{", end: '}'}, 
          {values: ["4", {values: ['O', 'is:', '1'], start: 'w{', end: '}'}, "5", "6"], start: '#{', end: '}'} 
        ]
        start: '(' 
        end: ')'
      } 
    ]
    assert.deepEqual result, target

  it "raises an error if blocks are mismatch", () ->
    s = new script.New """
      Var is:  ( { 1 2 3 ) w{ 4 5 6 } )
    """
    err = null
    try
      s.parse()
    catch e
      err = e

    assert.deepEqual err.message, "Closing the wrong block. actual: ) expected: }"

  it "raises an error if closing an unopened block", () ->
    s = new script.New """
      Var is: 1 2 3 } { 4 5 6 }
    """
    err = null
    try
      s.parse()
    catch e
      err = e

    assert.deepEqual err.message, "Ending unopened block: }"



