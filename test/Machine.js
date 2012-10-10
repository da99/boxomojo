var _          = require("underscore"),
    Pos        = require('factor_script/lib/Array_Position'),
    Var_Finder = require('factor_script/lib/Var_Finder'),
    Noun       = require('factor_script/lib/Noun'),
    Core       = require('factor_script/lib/Core'),
    Machine    = require('factor_script/lib/Machine');



var Factor_Script = function () {};
var FS            = Factor_Script;
var FS.Noun       = Noun;

FS.type_cast = function (str) {
  var num  = Number(str);
  if (_.isNumber(num) && !_.isNaN(num)) {
    return num;
  } else {
    return { value : str , 'is verb?' : true }
  };

  throw new Error('type_cast: unknown type: ' + str);
  var noun = new Noun();
  return noun;
};




Number.prototype.factor_script = function (verb, m) {
  switch (verb)  {
    case 'run-verb':
      var op = m.grab_forward().value;
      var num = m.grab_forward();
      switch (op) {
        case '+':
          return this + num;
          break;
        case '-':
          return this - num;
          break;
        case '/':
          return this / num;
          break;
        case '*':
          return this * num;
          break;
        default:
          throw new Error('number: unknown verb: ' + verb);
      };

      break;
    default:
      throw new Error('FS <-> JS: unknown verb: ' + verb);
  };

};

var assert = require('assert');

describe('Factor_Script interface to JavaScript', function () {


  // it( 'has multiple-named functions', function () {
    // var m = new Factor_Script.Machine(' #{ 1 2 }# + #{ 3 4 }# ');
    // m.go_forth();
    // assert.deepEqual( m.Returns, [1,2,3,4] );
  // });

  it( 'it runs words/tokens' , function () {
    var m = new Factor_Script.Machine("+ 2");
    assert.equal( (5).factor_script('run-verb', m), 7);
  });


  it('can add numbers', function () {
    var m = new Factor_Script.Machine("5 + 1");
    m.go_forth();
    assert.deepEqual( m.Returns, [FS.type_cast('6')]);
  });


  it('can substract numbers', function () {
    var m = new Factor_Script.Machine("5 - 1");
    m.go_forth();
    assert.deepEqual( m.Returns, [FS.type_cast('4')]);
  });


} ); // describe



