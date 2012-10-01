_      = require "underscore"
script = require "factor_script"
assert = require "assert"
List   = require "factor_script/lib/List"


new_code = (c) ->
  new script.New c

describe "List: w{", () ->

  it "allows keys", () ->

    s = new_code """
        Var is: w{
          name is: "LIST" ,
          city is: "Hong Kong"
        }
    """

    assert.deepEqual s.run().var_read("Var").to_hash(), { 
      name: "LIST"
      city: "Hong Kong"
    }
    
describe 'List: #{', () ->
  
  it "keeps a list of numerical indexes", () ->
    s = new_code """
        Var is: \#{ 1 , 2 , 3 }
    """

    assert.deepEqual s.run().stack, [1,2,3]    
    
