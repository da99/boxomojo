
Parse  = require('factor_script/lib/Parse')
Parser = Parse.Parser
assert  = require 'assert'
helpers = require "factor_script/lib/test/default"
_       = require 'underscore'

str = helpers.str
num = helpers.num

parse = (code) ->
  array = []
  p = new Parser(code)
  p.tokens

to_verb = (str) ->
  { 'verb?' : true, 'value' : str }
to_run_now_func = (o) ->
  Parse.To_Run_Now_Function(o)
to_func = (o) ->
  Parse.To_Function(o)
to_index = (o) ->
  Parse.To_Index(o)
to_list = (o) ->
  Parse.To_List(o)

describe "Parse", () ->

  it "returns an array of tokens", () ->
    result = parse """
      One is: uno
    """

    assert.deepEqual result, [ to_verb("One"), to_verb("is:"), to_verb("uno")]

describe "Parse Strings", () ->

  it "keeps strings together", () ->
    result = parse """
      "One" is: "This sentence."
    """
    assert.deepEqual result, ["One", to_verb("is:"), "This sentence." ]

  it 'escapes quotation marks with ^" and "^', () ->
    result = parse """
      Var is: "This sentence with ^"start and end!"^"
    """

    assert.deepEqual result, [to_verb("Var"), to_verb("is:"), 'This sentence with "start and end!"']

  it 'escapes escaped quotation marks with ^^" and "^^', () ->
    result = parse """
      Var is: "This sentence with ^^"start and end!"^^"
    """

    assert.deepEqual result, [to_verb("Var"), to_verb("is:"), 'This sentence with ^"start and end!"^']

  it "parse s[ ]s as a string", () ->
    result = parse """
      "One" is: s["This sentence."]s
    """
    assert.deepEqual result, ["One", to_verb("is:"), '"This sentence."' ]

  it "escapes ^s[ ]s^ with s[ ]s strings", () ->
    result = parse """
      "One" is: s[This ^s[sentence]s^.]s
    """
    assert.deepEqual result, ["One", to_verb("is:"), 'This s[sentence]s.' ]

describe "Parse Numbers", () ->

  it "parses integers as JavaScript integers", () ->
    result = parse """
      "One" is: 1
    """
    assert.deepEqual result, [ 'One', to_verb('is:'), 1 ]

  it "parses floats as JavaScript floats", () ->
    result = parse """
      "One" is: 1.5
    """
    assert.deepEqual result, [ 'One', to_verb('is:'), 1.5 ]

describe "Parse ( )", () ->

  it "separates ( ) as a Hash", () ->
    result = parse """
      "Var" is: ( 1 2 3 )
    """
    assert.deepEqual result, ["Var", to_verb("is:"), to_run_now_func( [ 1, 2, 3] )]

describe "Parse { }", () ->

  it "separates { } as a Function", () ->
    result = parse """
      "Var" is: { z x c }
    """
    assert.deepEqual result, [
      "Var",
      to_verb("is:"),
      to_func([ to_verb('z'), to_verb('x'), to_verb('c')] )
    ]

describe 'Parse [ ]', () ->

  it 'separates [ ] as a List', () ->
    result = parse ' "Var" is: [ x y z ] '
    assert.deepEqual result, [ "Var", to_verb("is:"),
      to_list( [to_verb('x'), to_verb('y'), to_verb('z')] )
    ]


describe 'Parse ~[ ]~', () ->

  it 'separates ~[ ]~ as an Index', () ->
    result = parse ' "Var" is: ~[ d e f ]~ '
    assert.deepEqual result, [ "Var", to_verb("is:"),
      to_index( [to_verb('d'), to_verb('e'), to_verb('f')] )
    ]

describe "Parse nesting blocks", () ->

  it "parses ( { } ) as a Function within a Run Now Function", () ->
    result = parse """
      "Var" is:  ( { "a" "b" "c" } { "d" "e" "f" } )
    """
    target = [
      "Var",
      to_verb("is:"),
      to_run_now_func( [
        to_func(['a','b','c']),
        to_func(['d','e','f']),
      ]
      )
    ]
    assert.deepEqual result, target

  it 'separates nested ( { } ~[ ~[  ]~ ]~ ) as a Hash', () ->
    result = parse ' "Var" is:  ( { "a" "b" "c" } ~[ d ~[ "O" is: "a" ]~ b c ]~ ) '
    target = [
      "Var",
      to_verb("is:"),
      to_run_now_func([
        to_func(['a','b','c']),
        to_index([
          to_verb('d'),
          to_index(['O', to_verb('is:'), 'a']),
            to_verb('b'),
            to_verb('c')
        ])
      ])
    ]

    assert.deepEqual result, target

  it "raises an error if blocks are mismatch", () ->
    err = null
    try
      parse """
        Var is:  ( { 1 2 3 ) ~[ 4 5 6 ] )
      """
    catch e
      err = e

    assert.deepEqual err.message, "Closing wrong block: expected: } actual: )"

  it "raises an error if closing an unopened block", () ->
    err = null
    try
      parse """
        Var is: 1 2 3 } { 4 5 6 }
      """
    catch e
      err = e

    assert.deepEqual err.message, "Closing unopened block: }"



