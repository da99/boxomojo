var _ = require("underscore"),
    Pos = require('factor_script/lib/Array_Position');


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
var FS = Factor_Script;

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
//                        Nouns
// ==============================================================

var Noun = FS.Noun = function () {
  this.Vars = {};
  this.Returns = [];
  this.Read_ables = {};
  this.Write_ables = {};
  this.Function_Lists = [];
};


Noun.prototype.value = function () {
  return this.Vars['value'];
};


Noun.prototype.new_private = function ( name, val ) {
  this.create(name, val);
  this.Read_ables[name] = false;
  return this;
};

Noun.prototype.new_read_able = function ( name, val ) {
  this.create(name, val);
  this.Read_ables[name] = true;
  return this;
};

Noun.prototype.create = function(name, val) {
  this.Vars[name] = val;
  return val;
};

Noun.prototype.update = function(name, val) {
  this.Vars[name] = val;
  return val;
};

Noun.prototype.find_verb_target = function (name, must_be_read_able) {
  if ( this.Vars.hasOwnProperty(name) && ( must_be_read_able ? (this.Read_ables[name]) : true )  )
    return this;

  var i = this.Function_Lists.len,
      ans = null;
  while( --i > -1 && !ans  ) {
    ans = this.Function_Lists[i].find_verb_target(name, true);
  };

  return ans;

};

Noun.prototype.find_verb_target_or_throw = function (name, must_be_read_able) {
  var n = this.find_verb_target(name, must_be_read_able);
  if (!n)
    throw new Error("find_verb_target: not found: " + name);
  return n;
};


// ==============================================================
//                        Numbers
// ==============================================================

var Number_Functions = FS.Number_Functions = new Noun();
Number_Functions.new_read_able("is number?", true);
Number_Functions.new_read_able('+', function (machine) {
  var l = machine.noun;
  var r = machine.grab_forward();
  return l + r;
});

Number_Functions.new_read_able('-', function (machine) {
  var l = machine.noun;
  var r = machine.grab_forward();
  return l - r;
});

// ==============================================================
//                        Verbs
// ==============================================================

var Verb_Functions = FS.Verb_Functions = new Noun();
Verb_Functions.new_read_able('is verb?', true);

// ==============================================================
//                        Machine
// ==============================================================
var Kernel = {
  '+' : {'functions list?' : true, 'functions': ['num+num']},
  '-' : {'functions list?' : true, 'functions': ['num-num']},
  '*' : {'functions list?' : true, 'functions': ['num*num']},
  '/' : {'functions list?' : true, 'functions': ['num/num']},
  'num+num' : {
    backward      : [ 'left',  'number?' ],
    forward       : [ 'right', 'number?' ],
    returns       : [ 'number?' ],
    'javascript?' : true,
    'function'    : function(local, outer) {
      return left + right;
    }
  },

  'num-num' : {
    backward : [ ['left',  'number?'] ],
    forward  : [ ['right', 'number?']],
    returns  : [ 'number?' ],
    "javascript?" : true,
    words    : function(local, outer) {
      return left - right;
    }
  },

  'num/num' : {
    backward : [ ['left',  'number?'] ],
    forward  : [ ['right', 'number?']],
    returns  : [ 'number?' ],
    "javascript?" : true,
    words    : function(local, outer) {
      return left / right;
    }
  },

  'num*num' : {
    backward : [ ['left',  'number?'] ],
    forward  : [ ['right', 'number?']],
    returns  : [ 'number?' ],
    "javascript?" : true,
    words    : function(local, outer) {
      return left * right;
    }
  }

}; // kernel



var Machine = FS.Machine = function (code) {
  this.Code = code;
  this.Returns = [];
  this.Vars    = {};
  this.Tokens = Parse(code);
};

// ==============================================================
//                        Machine Helpers
// ==============================================================

Machine.helpers = {

  is_verb_func_def_match : function (machine, func_def) {
    return null;
  },

  find_verb_in_noun : function (machine, noun) {
    var verb = machine.verb,
        v = noun[verb],
        pos = null,
        target = null,
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


Machine.prototype.insert = function (val) {
  var noun = FS.type_cast(val);
  this.Returns.push(noun);
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

  var f = Machine.helpers.find_verb_in_noun,
      v = this.verb,
      t = null,
      n = null,
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

  return f(this, Kernel);

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



