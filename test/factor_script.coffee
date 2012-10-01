
script = require "factor_script"
assert = require 'assert'
_      = require "underscore"

new_code = (c) ->
  new script.New c

describe "New", () ->

  it "returns a script", () ->
    s = new_code """
      One is: 1
    """
    assert.equal s["is a factor script?"](), true

  it "sets 'original code'", () ->
    code = """
      One is: 1
    """
    assert.equal new_code(code)["original code"](), code

describe "List", () ->

  it "allows both keys and automatic integer keys", () ->

    s = new_code """
        Var is: [
          name : "LIST" 
          two
          city : "Hong Kong"
        ]
    """

    assert.deepEqual s.run().get_var("Var").to_hash(), { 
      name: "LIST"
      "2":  "two"
      city: "Hong Kong"
    }
