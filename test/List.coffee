_      = require "underscore"
script = require "factor_script"
assert = require "assert"
# List   = require "factor_script/lib/List"
helpers = require "factor_script/lib/test/default"

new_code = helpers.new_code
str      = helpers.str
num      = helpers.num

describe "List: w{", () ->

  it "allows keys", () ->

    s = new_code """
        "Var" is: w{
          "name" is: "LIST" ,
          "city" is: "Hong Kong"
        }
    """
    
    assert.deepEqual s.run().var_read("Var"), { 
      name: str("LIST")
      city: str("Hong Kong")
    }
    
  it 'sets read env to outside', () ->
    s = new_code """
      "Uno" is: "uno"
      "One" is: "one"
      "Var"  is: w{ 
        "name" is: Uno
        "nick" is: One
      }
    """
    assert.deepEqual s.run().var_read("Var"), {
      name: str("uno")
      nick: str("one")
    }
    
describe 'List: #{', () ->
  
  it "keeps a list of numerical indexes", () ->
    s = new_code ' "Var" is: \#{ 1 , 2 , 3 } '
    s.run()
    
    assert.deepEqual s.var_read('Var'), [ num('1'), num('2'), num('3') ]
    
  it 'sets read env to outside', () ->
    s = new_code '
      "Uno" is: "uno"
      "One" is: "one"
      "Var"  is: #{ 
        "name" is: Uno
        "nick" is: One
      }
    '
    assert.deepEqual s.run().var_read("Var"), [ str("uno") , str("one") ]
    
