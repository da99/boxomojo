var _ = require("underscore");


var Parse = function (code) { 
  var strings = code.split( /\s+/g );
  var tokens  = [];
  var temp    = null;
  while(temp = strings.shift() ) {
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

Noun.prototype.find_noun_with_verb = function (name, must_be_read_able) {
  if ( this.Vars.hasOwnProperty(name) && ( must_be_read_able ? (this.Read_ables[name]) : true )  )
    return this;

  var i = this.Function_Lists.len,
      ans = null;
  while( --i > -1 && !ans  ) {
    ans = this.Function_Lists[i].find_noun_with_verb(name, true);
  };
  
  return ans;
  
};

Noun.prototype.find_noun_with_verb_or_throw = function (name, must_be_read_able) {
  var n = this.find_noun_with_verb(name, must_be_read_able);
  if (!n)
    throw new Error("find_noun_with_verb: not found: " + name);
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
var Machine = FS.Machine = function (code) {
  this.Code = code;
  this.Returns = [];
  this.Tokens = Parse(code);
};


Machine.prototype.save_and_go_forth = function (val) {
  this.save(val);
  return this.go_forth();
};

Machine.prototype.save = function (val) {
  var noun = FS.type_cast(val);
  this.Returns.push(noun);
};

Machine.prototype.grab_backward = function () {
  return this.Returns.shift();
};

Machine.prototype.grab_forward = function () {
  return this.Tokens.shift();
};

Machine.prototype.run_verb = function () {
  if ( _.isNumber(this.noun) ) {
    var n = Number_Functions; 
  } else  {
    var n = this.noun
  };
  
  var v = n.find_noun_with_verb_or_throw( this.verb, true ).Vars[this.verb];
  if ( _.isFunction(v) ) {
    this.Returns.push(v(this));
  } else {
    this.Returns.push( v );
  };
};

Machine.prototype.go_forth = function () {
  this.token = this.Tokens.shift();
  
  if(this.token) {
    
    if (this.token['is verb?']) {
      this.verb = this.token.value;
      this.noun = this.grab_backward();
      this.run_verb();
    } else {
      this.Returns.push(this.token);
    };
    
    this.go_forth();
    
  } else {
    
    return _.last(this.Returns);

  };
  
};

var assert = require('assert');


it('can add numbers', function () {
  var m = new Machine("5 + 1");
  m.go_forth();
  assert.deepEqual( m.Returns, [FS.type_cast('6')]);
});

it('can substract numbers', function () {
  var m = new Machine("5 - 1");
  m.go_forth();
  assert.deepEqual( m.Returns, [FS.type_cast('4')]);
});


