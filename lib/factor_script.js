
var _           = require('underscore'),
    h           = require('factor_script/lib/helpers'),
    Parse       = require('factor_script/lib/Parse'),
    Core        = require('factor_script/lib/Core'),
    Pos         = require('factor_script/lib/Array_Position'),
    Objects     = require('factor_script/lib/Objects'),
    Func_Finder = require('factor_script/lib/Func_Finder');


// ==============================================================
//                        Box
// ==============================================================

var Box = function (code, outside) {

  if (_.isArray(code)) {
    this.Code   = null;
    this.Tokens = code;
  } else {
    this.Code   = code;
    this.Tokens = Parse(this);
  };

  this.Returns = [];
  this.Vars    = {};
  this.Outside = outside;
  this.Inside  = true;

  this['Functions']        = [];
  this['Function Aliases'] = {};
  this['Modules']          = [];

  if (outside) {
    this.is_local(false);
  } else {
    this.is_local(true);
  };

};


// ==============================================================
//                        Box Prototype
// ==============================================================

Box.prototype.spawn  = function (tokens) {
  var box = new Box(tokens, this);
  return box;
};

Box.prototype.is_box = function () {
  return true;
};

Box.prototype.is_local = function () {
  if (arguments.length == 1) {
    this.Inside = !!arguments[0];
  };
  return this.Inside;
};

Box.prototype.return_backward = function (val) {
  return this.Returns.push(val);
};

Box.prototype.respond = function (val) {
  return this.Returns.push(val);
};

Box.prototype.compile_forward = function () {
  var val = this.Tokens[0];
  if (!val || !val['raw?'])
    return val;

  var raw  = val,
      fin  = null,
      kind = raw['kind'];

  switch (kind) {
    case 'function call':
      throw new Error('handle function call');
      break;
    case 'run now function?':
      throw new Error('handle run now function');
      break;
    case 'function':
      throw new Error('handle function');
      break;
    case 'list':
      fin = Objects.List(val, this);
      break;
    case 'index':
      throw new Error('handle index');
      break;
    case 'object':
      throw new Error('handle object');
      break;
    default:
      throw new Error('Unknown Factor_Script raw type: ' + raw);
  };

  this.Tokens[0] = fin;
  return fin;
};

Box.prototype.see_backward = function () {
  return this.Returns[this.Returns.length - 1];
};

Box.prototype.see_forward = function () {
  return this.compile_forward();
};

Box.prototype.grab_backward = function () {
  return this.Returns.pop();
};

Box.prototype.grab_forward = function () {
  this.compile_forward();
  return this.Tokens.shift();
};

Box.prototype.ensure_Returns_not_empty = function (msg) {
  if (this.Returns.length == 0)
    throw new Error(this['function call'] + ": Returns stack " + (msg || 'can\'t be empty.'));
  return true;
};

Box.prototype.ensure_Tokens_not_empty = function (msg) {
  if (this.Tokens.length == 0)
    throw new Error(this['function call'] + ": Tokens stack " + (msg || 'can\'t be empty.'));
  return true;
};

Box.prototype.ensure_both_stacks_not_empty = function (msg) {
  this.ensure_Returns_not_empty(msg);
  this.ensure_Tokens_not_empty(msg);
  return true;
};

Box.prototype.wrong_types = function () {
  var args = _.toArray(arguments),
      msg  = ((args[0])          ? args.shift() : "Unknown types"),
      suff = null;

  if (args.length !== 0) 
    msg += ' ' + args.joing(', ');

  throw new Error(this['function call'] + ": " + msg);
};

Box.prototype.is_applicable_func = function (func) {
  return func && func['is_function']();
};

Box.prototype.run_func_if_found = function (finder) {
  while( finder.next() ) {
    if (this.is_applicable_func(finder.value)) {
      finder.value(this);
      return true;
    };
  };
  return false;
};

Box.prototype.run = function () {
  var finder = null;
  this.token = this.grab_forward();

  if(!this.token)
    return _.last(this.Returns);

  if (!this.token['function call?']) {
    this.Returns.push(this.token);
    return this.run();
  };

  this['function call'] = this.token.value;

  // === Find function in box.
  finder = new Func_Finder.Box(this);
  if (this.run_func_if_found(finder))
    return this.run();

  // === Find function in Object.
  this.JS_Object = this.grab_backward();
  if (this.JS_Object) {
    this.Object    = Objects.js_to_fs(this.JS_Object);
    finder         = new Func_Finder.Object( this.Object, this['function call'] );
    if (this.run_func_if_found(finder) )
      return this.run();

    this.return_backward(this.JS_Object);
    this.JS_Object = null;
    this.Object    = null;
  };

  // === Find function in Outside.
  if (this.Outside && !this.is_local()) {
    finder = new Func_Finder.Box( this.Outside );
    if (this.run_func_if_found(finder))
      return this.run();
  };

  // === Find function in Core.
  finder = new Func_Finder.Object(Core['Vars'], this['function call']);
  if (this.run_func_if_found(finder))
    return this.run();

  throw new Error('run: function not found: ' + this['function call']);
};

var factor_script = function (code) { };
factor_script.Box = Box;
module.exports    = factor_script;





