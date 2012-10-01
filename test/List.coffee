_      = require "underscore"
script = require "factor_script"
assert = require "assert"
List   = require "factor_script/lib/List"


describe "List", () ->

  it "allows both keys and automatic integer keys", () ->

    s = new_code """
        Var is: *{
          name is: "LIST" 
          "two"
          city is: "Hong Kong"
        }
    """

    assert.deepEqual s.run().get_var("Var").to_hash(), { 
      name: "LIST"
      "2":  "two"
      city: "Hong Kong"
    }
    
describe "List push", () ->
  
  it "keeps a list of numerical indexes"
  
