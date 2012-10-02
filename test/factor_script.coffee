
assert = require 'assert'
_      = require "underscore"
helpers = require "factor_script/lib/test/default"

new_code = helpers.new_code
num      = helpers.num
str      = helpers.str
  
describe "New", () ->

  it "returns a script", () ->
    s = new_code """
      One is: 1
    """
    assert.equal s["is env?"], true

  it "sets 'original code'", () ->
    code = """
      One is: 1
    """
    assert.equal new_code(code)["original code"], code

describe '.run()', () ->
    
  it 'raises error if word not found', () ->
    word = 'not-found-xyz'
    s = new_code " " + word + " "
    try   
      s.run()
    catch e
      err = e
    assert.deepEqual err.message, "run: Word not defined: " + word

describe 'Base variables create', () ->
  
  it 'saves variable to stack', () ->

    s = new_code ' "One" is: 1 '
    s.run()
    assert.deepEqual s.stack(), [ num('1') ]

  it 'saves variables to w{}s', () ->

    s = new_code ' "One" is: 1 '
    s.run()
    assert.deepEqual s.stack('Local Vars'), { 'One': num('1')}

describe 'Stack', () ->

  it 'adds numbers to stack', () ->
    s = new_code ' 1 2 3 '
    s.run()
    assert.deepEqual s.stack(), [ num('1'), num('2'), num('3') ]
    
  it 'adds quoted strings to stack', () ->
    s = new_code ' "a"  "long string" "c" '
    s.run()
    assert.deepEqual s.stack(), [ str('a'), str('long string'), str('c') ]
    
    
    
    
