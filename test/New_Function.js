
var assert  = require('assert'),
    _       = require("underscore"),
    h       = require("factor_script/lib/test/default"),
    Parse   = require('factor_script/lib/Parse');

var new_code = h.new_code,
    returns  = h.returns,
    vars     = h.vars;

describe( 'New Function', function () {

  it( 'raises error if return values length are unequal to return requirements length', function () {
    var err = null;

    var str = '          \
      "Obj" = o[ ]o    \
      <+[                \
        { } "++" { } { ~~~? } \
        { } \
      ]+>        \
      Obj ++     \
    ';

    try {
      new_code(str).run();
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, "++: returning inadequate number of values: [empty list] => ~~~?" );
  });

  it( 'creates a runnable function', function () {
    var str = '          \
      "Obj" = o[ ]o    \
      <+[                \
        { } "++" { } { ~~~? } \
        { "+added+" } \
      ]+>        \
      Obj ++     \
    ';
    assert.equal(_.last(returns(str)), '+added+');
  });

  it( 'defines new function in target object', function () {
    var str = '          \
      "Obj" = o[ ]o    \
      <+[                \
        { } "++" { } { ~~~? } \
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
        { } "++" { } { ~~~? } \
        { "it works" } \
      ]+>        \
      ++ ';
    var box = new_code(str);
    box.run()
    assert.equal( !!box.Functions['++'], true );
    assert.equal( box.see_backward(), "it works");
  });

}); // === describe

describe( 'New Function errors: ', function () {
  it( 'throws error if backward stack is uneven', function () {
    var str = ' "Obj" = o[ ]o <+[ { "name" } "++" { } { ~~~? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Uneven number of parameters.')
  });

  it( 'throws error if forward stack is uneven', function () {
    var str = ' "Obj" = o[ ]o <+[ { } "++" { "name" } { ~~~? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Uneven number of parameters.')
  });

  it( 'throws error if argument name is not a string', function () {
    var str = ' "Obj" = o[ ]o <+[ { } "++" { 2 number? } { ~~~? } { "++" } ]+>';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e;
    };
    assert.equal(err.message, '<+[: Name of argument must be a string: 2')
  });

  it( 'throws error if returning values do not pass', function () {
    var str = ' [<>] <+[ { } "++" { } { ~~~? ~~~? } { 5 5 } ]+> ++ ';
    var err = null;
    try {
      returns(str);
    } catch (e) {
      err = e
    };
    assert.equal(err.message, "++: returned values do not match requirements: 5 5 => ~~~? ~~~?");
  });
}); // === describe

describe( 'New Function Alias', function () {
  it( 'creates alias in object', function () {
    var str = '     \
    "KV" = o[ ]o  \
    KV "key" <=+=< "new_key"                            \
    KV <+[ { } "new_key" { } { ~~~? }  \
           {  "new func called" }                            \
    ]+>                                               \
    KV key ';
    assert.equal(_.last(returns(str)), "new func called");
  });

  it( 'can create alias in [<>]', function () {
    var str = '             \
    [<>] "~~~?" <=+=< "+five+"          \
    [<>] <+[ { } "+five+" { } { #? }  \
    { 10 } ]+>   \
    5 ~~~? ';
    assert.equal(_.last(returns(str)), 10);
  });
}); // === describe

