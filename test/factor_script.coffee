
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

