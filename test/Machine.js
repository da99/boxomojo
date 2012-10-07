var _          = require("underscore"),
    Pos        = require('factor_script/lib/Array_Position'),
    Var_Finder = require('factor_script/lib/Var_Finder'),
    Noun = require('factor_script/lib/Noun'),
    Core = require('factor_script/lib/Core');


var Parse = function (code) {
  var strings = code.split( /\s+/g );
  var tokens  = [];
  var temp    = null;
  while( strings.length ) {
    temp = strings.shift();
    if(temp != '' )
      tokens.push(FS.type_cast(temp));
  };

  return tokens;
};

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


// ==============================================================
//                        Machine
// ==============================================================

var Machine = FS.Machine = function (code, outside) {

  this.Code    = code;
  this.Returns = [];
  this.Vars    = {};
  this.Tokens  = Parse(code);
  this.Outside = outside;
  this.Local   = true;

  if (outside) {
    this.is_local(false);
  } else {
    this.is_local(true);
  };

};

// ==============================================================
//                        Machine Helpers
// ==============================================================

Machine.helpers = {

  is_verb_func_def_match : function (machine, func_def) {
    return null;
  },

  find_verb_in_noun : function (machine, noun) {
    var verb     = machine.verb,
        v        = noun[verb],
        pos      = null,
        target   = null,
        func_def = null;

    if( v && v['functions list?']) {

      pos = new Pos(v['functions'], 'bottom');

      while(pos.next()) {
        func_def = noun[pos.value()]
        if(Machine.helpers.is_verb_func_def_match(machine, func_def))
          return func_def;
      };

    };


    if (v)
      return v;

    var f = noun["functions list"];
    if ( !f )
      return null;

    pos = new Pos(f, 'bottom');
    while ( pos.next() ) {
      target = Machine.helpers.find_verb_in_noun(machine, pos.value());
      if (target)
        return target;
    };

    return v;

  }

};


// ==============================================================
//                        Machine Prototype
// ==============================================================

Machine.prototype.is_local = function () {
  if (arguments.length == 1) {
    this.Local = !!arguments[0];
  };
  return this.Local;
};

Machine.prototype._return = function (val) {
  this.Returns.push(FS.type_cast(val));
};

Machine.prototype.see_backward = function () {
  return this.Returns[this.Returns.length - 1];
};

Machine.prototype.see_forward = function () {
  return this.Tokens[0];
};

Machine.prototype.grab_backward = function () {
  return this.Returns.pop();
};

Machine.prototype.grab_forward = function () {
  return this.Tokens.shift();
};

Machine.prototype.find_verb = function () {

  var f      = Machine.helpers.find_verb_in_noun,
      v      = this.verb,
      t      = null,
      n      = null,
      n_type = null;

  t = f(this, this.Vars)

  if (t)
    return t;

  if (n) {
    if (_.isNumber(n) && !_.isNaN(n)) {
      n_type = Number_Functions;
    } else if (_.isString(n)) {
      n_type = String_Functions;
    } else if (_.isArray(n)) {
      n_type = Array_Functions;
    } else if (_.isObject(n) && !n['functions list']) {
      n_type = Hash_Functions;
    }

    t = f(this, n_type);
  };

  if (t)
    return t;

  return f(this, Core);

};

Machine.prototype.go_forth = function () {
  this.token = this.Tokens.shift();

  if(this.token) {

    if (this.token['is verb?']) {
      this.verb = this.token.value;
      this.noun = this.grab_backward();

      // === Find function.


      var v = this.find_verb();
      if (!v)
        throw new Error('go_forth: verb not found: ' + this.verb);

      if ( _.isFunction(v) ) {
        this.Returns.push(v(this));
      } else {
        this.Returns.push( v );
      };

    } else {
      this.Returns.push(this.token);
    };

    this.go_forth();

  } else {

    return _.last(this.Returns);

  };

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



