
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
      "Obj" = +[ ]+    \
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
      "Obj" = +[ ]+    \
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
    var str = ' "Obj" = +[ ]+ <+[ { "name" } "++" { } { string? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Uneven number of parameters.')
  });

  it( 'throws error if forward stack is uneven', function () {
    var str = ' "Obj" = +[ ]+ <+[ { } "++" { "name" } { string? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Uneven number of parameters.')
  });

  it( 'throws error if argument name is not a string', function () {
    var str = ' "Obj" = +[ ]+ <+[ { } "++" { 2 number? } { string? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Name of argument must be a string: 2')
  });

  it( 'throws error if returning values do not pass', function () {
    var str = ' [<>] <+[ { } "++" { } { string? string? } { 5 5 } ]+> ++ ';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e
    };
    assert.equal(err.message, "++: returned values do not match requirements: 5 5 => string? string?");
  });
}); // === describe

describe( 'New Function Alias', function () {
  it( 'creates alias in object', function () {
    var str = '     \
    "KV" = ~[ ]~  \
    KV "key" <=+=< "new_key"                            \
    KV <+[ { } "new_key" { } { string? }  \
           {  "new func called" }                            \
    ]+>                                               \
    KV key ';
    assert.equal(_.last(returns(str)), "new func called");
  });

  it( 'can create alias in [<>]', function () {
    var str = '             \
    [<>] "string?" <=+=< "+five+"          \
    [<>] <+[ { } "+five+" { } { number? }  \
    { 10 } ]+>   \
    5 string? ';
    assert.equal(_.last(returns(str)), 10);
  });
}); // === describe

