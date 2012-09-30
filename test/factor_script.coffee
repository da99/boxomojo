
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
