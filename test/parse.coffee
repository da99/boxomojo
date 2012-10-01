
script = require "factor_script"
assert = require 'assert'
helpers = require "factor_script/lib/test/default"

str = helpers.str
num = helpers.num

describe "Parse", () ->

  it "returns an array", () ->
    s = new script """
      One is: uno
    """
    result = s.parse()
    assert.deepEqual result, ["One", "is:", "uno"]

describe "Parse Strings", () ->
  
  it "keeps strings together", () ->
    s = new script """
      One is: "This sentence."
    """
    result = s.parse()
    assert.deepEqual result, ["One", "is:", str("This sentence.")]

  it 'escapes quotation marks with ^" and "^', () ->
    s = new script """
      Var is: "This sentence with ^"start and end!"^"
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", str 'This sentence with "start and end!"']

  it 'escapes escaped quotation marks with ^^" and "^^', () ->
    s = new script """
      Var is: "This sentence with ^^"start and end!"^^"
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", str 'This sentence with ^"start and end!"^']

describe "Parse Numbers", () ->

  it "puts numbers into an object", () ->
    s = new script """
      "One" is: 1
    """
    result = s.parse()
    assert.deepEqual result, [ str('One'), 'is:', num('1')]

describe "Parse ( )", () ->

  it "separates ( ) as a Hash", () ->
    s = new script """
      Var is: ( 1 2 3 )
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ num("1"), num("2"), num("3")], start: '(', end: ')' } ]

describe "Parse { }", () ->

  it "separates { } as a Hash", () ->
    s = new script """
      Var is: { v t y }
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: "v t y".split(" "), start: '{', end: '}' } ]

describe 'Parse #{ }', () ->

  it 'separates #{ } as a Hash', () ->
    s = new script ' Var is: #{ d e f } '
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "d", "e", "f"], start: '#{', end: '}' } ]

describe "Parse w{ }", () ->

  it "separates w{ } as a Hash", () ->
    s = new script """
      Var is: w{ a b c }
    """
    result = s.parse()
    assert.deepEqual result, ["Var", "is:", { values: [ "a", "b", "c"], start: 'w{', end: '}' } ]
    
    
    
describe "Parse nesting blocks", () ->
    
  it "separates nested ( { } ) as a Hash", () ->
    s = new script """
      Var is:  ( { a b c } { d e f } )
    """
    result = s.parse()
    target = [ 
      "Var", 
      "is:", 
      {
        values: [ 
          {values: "a b c".split(" "), start: "{", end: '}'},
          {values: "d e f".split(" "), start: "{", end: '}'} ]
        start: '('
        end: ')'
      } 
    ]
    assert.deepEqual result, target
    
  it 'separates nested ( { } #{ w{ } } ) as a Hash', () ->
    s = new script ' Var is:  ( { a b c } #{ d w{ O is: a } b c } ) '
    result = s.parse()
    target = [ 
      "Var", 
      "is:", 
      {
        values: [ 
          {values: ["a", "b", "c"], start: "{", end: '}'}, 
          {values: ["d", {values: ['O', 'is:', 'a'], start: 'w{', end: '}'}, "b", "c"], start: '#{', end: '}'} 
        ]
        start: '(' 
        end: ')'
      } 
    ]
    assert.deepEqual result, target

  it "raises an error if blocks are mismatch", () ->
    s = new script """
      Var is:  ( { 1 2 3 ) w{ 4 5 6 } )
    """
    err = null
    try
      s.parse()
    catch e
      err = e

    assert.deepEqual err.message, "Closing the wrong block. actual: ) expected: }"

  it "raises an error if closing an unopened block", () ->
    s = new script """
      Var is: 1 2 3 } { 4 5 6 }
    """
    err = null
    try
      s.parse()
    catch e
      err = e

    assert.deepEqual err.message, "Ending unopened block: }"



