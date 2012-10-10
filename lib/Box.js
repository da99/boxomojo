var _          = require("underscore"),
    Parse      = require('factor_script/lib/Parse'),
    Core       = require('factor_script/lib/Core'),
    Pos        = require('factor_script/lib/Array_Position'),
    Var_Finder = require('factor_script/lib/Var_Finder');


// ==============================================================
//                        Box
// ==============================================================

var Box = FS.Box = function (code, outside) {

  this.Code    = code;
  this.Returns = [];
  this.Vars    = {};
  this.Tokens  = Parse(this);
  this.Outside = outside;
  this.Inside   = true;

  if (outside) {
    this.is_local(false);
  } else {
    this.is_local(true);
  };

};


// ==============================================================
//                        Box Prototype
// ==============================================================

Box.type_cast = function (str) {
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

Box.prototype.is_local = function () {
  if (arguments.length == 1) {
    this.Inside = !!arguments[0];
  };
  return this.Inside;
};

Box.prototype.return_backward = function (val) {
  this.Returns.push(FS.type_cast(val));
};

Box.prototype.respond = function (val) {
  this.Returns.push(FS.type_cast(val));
};

Box.prototype.see_backward = function () {
  return this.Returns[this.Returns.length - 1];
};

Box.prototype.see_forward = function () {
  return this.Tokens[0];
};

Box.prototype.grab_backward = function () {
  return this.Returns.pop();
};

Box.prototype.grab_forward = function () {
  return this.Tokens.shift();
};

Box.prototype.find_verb = function () {

  var f      = Box.helpers.find_verb_in_noun,
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

Box.prototype.is_applicable_func = function (func) {
  if (func['core?'])
    return true;
  return false;
};

Box.prototype.run_func = function (factor_script_func) {

};

Box.prototype.run_func_if_found = function (finder) {
  while( finder.next_verb() ) {
    if (this.is_applicable_func(finder.value)) {
      this.run_func(finder.value);
      return true;
    };
  };
  return false;
};

Box.prototype.go_forth = function () {
  this.token = this.Tokens.shift();

  if(!this.token) {
    return _.last(this.Returns);
  };

  if (!this.token['verb?']) {
    this.Returns.push(this.token);
    return this.go_forth();
  };

  this.verb = this.token.value;

  // === Find function in box
  var finder = Var_Finder.Box(this);
  if (this.run_func_if_found(finder))
    return this.go_forth();

  // === Find function in Noun.
  this.noun = this.Noun( this.grab_backward() );
  var finder = Var_Finder.Noun( this.noun, this.verb );
  if (this.run_func_if_found(finder) )
      return this.go_forth();

  this.return_backward(this.noun);
  this.noun = null;

  // === Find function in Outside.
  if (this.Outside && !this.is_local()) {
    var finder = Var_Finder.Noun( Core );
    if (this.run_func_if_found(finder))
      return this.go_forth();
  };

  // === Find function in Core.
  if (Core.JavaScript[this.verb]) {
    Core.JavaScript[this.verb](this);
    return this.go_forth();
  };

  var finder = Var_Finder.Noun(Core, this.verb);
  if (this.run_func_if_found(finder))
    return this.go_forth();

  throw new Error('go_forth: verb not found: ' + this.verb);

};
