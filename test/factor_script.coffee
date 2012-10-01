
assert = require 'assert'
_      = require "underscore"
helpers = require "factor_script/lib/test/default"

new_code = helpers.new_code
  
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

