
var Parser = require('boxomojo/lib/Parser').Parser
, assert   = require('assert')
, helpers  = require("boxomojo/test/helpers/default")
, _        = require('underscore')
;

var str = helpers.str;
var num = helpers.num;

function parse(code) {
  var p = Parser.new(code);
  return p.tokens;
}

function to_verb (str) {
  return { 'raw?' : true, 'kind' : 'func_call', tokens: [str], 'func_call?' : true, value : str };
}

function to_run_now_func (o) { return Parser.To_Run_Now_Function(o); }
function to_func (o)         { return Parser.To_Function(o);         }
function to_index (o)        { return Parser.To_Index(o);            }
function to_object (o)       { return Parser.To_Object(o);           }
function to_list (o)         { return Parser.To_List(o);             }

describe("Parse", function () {

  it("returns an array of tokens", function () {
    var result = parse(' "One" = uno ');
    assert.deepEqual(result, [ "One", to_verb("="), to_verb("uno")] );
  });

});

describe("Parse Strings", function () {

  it('parses strings with surrounding spaces: " a "', function () {
    var result = parse(' " a " ');
    assert.deepEqual(result, [' a ']);
  });

  it("keeps strings together", function () {
    var result = parse(' "One" is: "This sentence." ');
    assert.deepEqual(result, ["One", to_verb("is:"), "This sentence." ]);
  });

  it('escapes quotation marks with ^" and "^', function () {
    var result = parse(' Var is: "This sentence with ^"start and end!"^" ');

    assert.deepEqual(result, [to_verb("Var"), to_verb("is:"), 'This sentence with "start and end!"']);
  });

  it('escapes escaped quotation marks with ^^" and "^^', function () {
    var result = parse(' Var is: "This sentence with ^^"start and end!"^^" ');

    assert.deepEqual(result, [to_verb("Var"), to_verb("is:"), 'This sentence with ^"start and end!"^']);
  });

  it("parse &[ ]& as a string", function () {
    var result = parse(' "One" is: &["This sentence."]& ');
    assert.deepEqual(result, ["One", to_verb("is:"), '"This sentence."' ]);
  });

  it("escapes ^&[ ]&^ with &[ ]& strings", function () {
    var result = parse(' "One" is: &[This ^&[sentence]&^.]& ');
    assert.deepEqual(result, ["One", to_verb("is:"), 'This &[sentence]&.' ]);
  });

});

describe("Parse Numbers", function () {

  it("parses integers as JavaScript integers", function () {
    var result = parse(' "One" is: 1 ');
    assert.deepEqual(result, [ 'One', to_verb('is:'), 1 ]);
  });

  it("parses floats as JavaScript floats", function () {
    var result = parse(' "One" is: 1.5 ');
    assert.deepEqual(result, [ 'One', to_verb('is:'), 1.5 ]);
  });
});

describe("Parse ( )", function () {

  it("separates ( ) as a Hash", function () {
    var result = parse(' "Var" is: ( 1 2 3 ) ');
    assert.deepEqual(result, ["Var", to_verb("is:"), to_run_now_func( [ 1, 2, 3] )]);
  });
});

describe("Parse f[ ]f", function () {

  it("separates f[ ]f as a Function", function () {
    var result = parse(' "Var" = f[ z x c ]f ');
    assert.deepEqual(result, [
      "Var",
      to_verb("="),
      to_func([ to_verb('z'), to_verb('x'), to_verb('c')] )
    ]);
  });
});

describe('Parse [ ]', function () {

  it('separates [ ] as a List', function () {
    var result = parse(' "Var" is: [ x y z ] ');
    assert.deepEqual(result, [ "Var", to_verb("is:"),
      to_list( [to_verb('x'), to_verb('y'), to_verb('z')] )
    ]);
  });
});


describe('Parse w[ ]w', function () {

  it('separates w[ ]w as a Box', function () {
    var result = parse(' "Var" = w[ d e f ]w ');
    assert.deepEqual(result, [ "Var", to_verb("="),
      to_object( [to_verb('d'), to_verb('e'), to_verb('f')] )
    ]);
  });
});

describe("Parse nesting blocks", function () {

  it("parses ( f[ ]f ) as a Function within a Run Now Function", function () {
    var result = parse(' "Var" is:  ( f[ "a" "b" "c" ]f f[ "d" "e" "f" ]f ) ');
    var target = [
      "Var",
      to_verb("is:"),
      to_run_now_func( [
        to_func(['a','b','c']),
        to_func(['d','e','f']),
      ]
      )
    ]
    assert.deepEqual(result, target);
  });

  it('separates nested ( f[ ]f  w[ w[ ]w ]w ) as a Hash', function () {
    var result = parse(' "Var" is:  ( f[ "a" "b" "c" ]f w[ d w[ "O" is: "a" ]w b c ]w ) ');
    var target = [
      "Var",
      to_verb("is:"),
      to_run_now_func([
        to_func(['a','b','c']),
        to_object([
          to_verb('d'),
          to_object(['O', to_verb('is:'), 'a']),
            to_verb('b'),
            to_verb('c')
        ])
      ])
    ]

    assert.deepEqual(result, target);
  });

  it("raises an error if blocks are mismatch", function () {
    var err = null;
    try {
      parse(' Var is:  ( w[ 1 2 3 ) ~[ 4 5 6 ] ) ');
    } catch(e) {
      err = e;
    }

    assert.deepEqual(err.message, "Closing wrong block: expected: ]w actual: )");
  });

  it("raises an error if closing an unopened block", function () {
    var err = null;
    try {
      parse(' Var is: 1 2 3 ]w w[ 4 5 6 ]w ');
    } catch (e) {
      err = e
    }

    assert.deepEqual(err.message, "Closing unopened block: ]w");
  });

});












