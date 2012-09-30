
script = require "factor_script"
assert = require 'assert'

describe "New", () ->

  it "returns a script", () ->
    s = new script.New """
      One is: 1
    """
    assert.equal s["is a factor script?"](), true

  it "sets 'original code'", () ->
    code = """
      One is: 1
    """
    s = new script.New code
    assert.equal s["original code"](), code

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
    assert.deepEqual result, ["One", "is:", "This sentence."]

  it 'escapes quotation marks with ^" and "^', () ->
    s = new script.New """
      Var is: "This sentence with ^"start and end!"^"
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", 'This sentence with "start and end!"']

  it 'escapes escaped quotation marks with ^^" and "^^', () ->
    s = new script.New """
      Var is: "This sentence with ^^"start and end!"^^"
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", 'This sentence with ^"start and end!"^']

describe "Parse ( )", () ->

  it "separates ( ) as a Hash", () ->
    s = new script.New """
      Var is: ( 1 2 3 )
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], char: '(' } ]

describe "Parse { }", () ->

  it "separates { } as a Hash", () ->
    s = new script.New """
      Var is: { 1 2 3 }
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], char: '{' } ]

describe "Parse [ ]", () ->

  it "separates { } as a Hash", () ->
    s = new script.New """
      Var is: [ 1 2 3 ]
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "1", "2", "3"], char: '[' } ]
    
    
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
        values: [ {values: ["1", "2", "3"], char: "{"}, {values: ["4", "5", "6"], char: "{"} ]
        char: '(' 
      } 
    ]
    assert.deepEqual result, target
    
  it "separates nested ( { } [ ] ) as a Hash", () ->
    s = new script.New """
      Var is:  ( { 1 2 3 } [ 4 5 6 ] )
    """
    result = s.parse()
    target = [ 
      "Var", 
      "is:", 
      {
        values: [ 
          {values: ["1", "2", "3"], char: "{"}, 
          {values: ["4", "5", "6"], char: "["} 
        ]
        char: '(' 
      } 
    ]
    assert.deepEqual result, target

  it "raises an error if blocks are mismatch", () ->
    s = new script.New """
      Var is:  ( { 1 2 3 ] [ 4 5 6 } )
    """
    err = null
    try
      s.parse()
    catch e
      err = e

    assert.deepEqual err.message, "Closing the wrong block. actual: ] expected: }"

  it "raises an error if closing an unopened block", () ->
    s = new script.New """
      Var is: 1 2 3 ] [ 4 5 6 ]
    """
    err = null
    try
      s.parse()
    catch e
      err = e

    assert.deepEqual err.message, "Ending unopened block: ]"
