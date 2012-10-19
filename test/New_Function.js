
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'New Function', function () {

  it( 'creates a runnable function', function () {
    var str = '          \
      "Obj" is: +[ ]+    \
      <+[                \
        { } "++" { } { string? } \
        { "++" } \
      ]+>        \
      Obj ++     \
    ';
    assert.equal(_.last(returns(str)), '++');
  });

  it( 'defines new function in target object', function () {
    var str = '          \
      "Obj" is: +[ ]+    \
      <+[                \
        { } "++" { } { string? } \
        { "++" } \
      ]+>        \
      Obj ++     \
    ';
    assert.equal( !!vars(str).Obj.Functions['++'].toString(), true);
  });

  it( 'can define new function in [<>]', function () {
    var str = '            \
      [<>]                 \
      <+[                  \
        { } "++" { } { string? } \
        { "it works" } \
      ]+>        \
      ++ ';
    var box = new_code(str);
    box.run()
    assert.equal( !!box.Functions['++'], true );
    assert.equal(_.last(box.Returns), "it works");
  });

}); // === describe

describe( 'New Function errors: ', function () {
  it( 'throws error if backward stack is uneven', function () {
    var str = ' "Obj" is: +[ ]+ <+[ { "name" } "++" { } { string? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Uneven number of parameters.')
  });

  it( 'throws error if forward stack is uneven', function () {
    var str = ' "Obj" is: +[ ]+ <+[ { } "++" { "name" } { string? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Uneven number of parameters.')
  });

  it( 'throws error if argument name is not a string', function () {
    var str = ' "Obj" is: +[ ]+ <+[ { } "++" { 2 number? } { string? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Name of argument must be a string: 2')
  });

  it( 'throws error if returning values do not pass', function () {
    var str = ' [<>] <+[ { } "++" { } { string? } { 5 } ]+> ++ ';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e
    };
    assert.equal(err.message, "++: returning value must be a string?: 5");
  });
}); // === describe

describe( 'New Function Alias', function () {
  it( 'creates alias in object', function () {
    var str = '     \
    "KV" is: ~[ ]~  \
    KV "key" =+= "new_key"                            \
    KV <+[ { } "new_key" { "A" string? } { string? }  \
           {  A + " key" }                            \
    ]+>                                               \
    KV key "new" ';
    assert.equal(_.last(returns(str)), "new key");
  });

  it( 'can create alias in [<>]', function () {
    var str = ' \
    [<>] <=+ "+" \
      { "A" number? } "+five+" { "B" number? } { number? } \
      { A + B + 5 } \
    /+=>            \
    5 + 5 ';
    assert.equal(_.last(returns(str)), 15);
  });
}); // === describe

