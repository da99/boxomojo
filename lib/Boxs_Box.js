var _ = require('underscore'),
h = require('factor_script/lib/helpers'),
Func_Finder = require('factor_script/lib/Func_Finder'),
Parse       = require('factor_script/lib/Parse');

var Boxs = null;
module.exports = {};
var o = module.exports;

o.init = function (obj) {
  Boxs = obj;
};

o.fs = {
  'x[]x?' : function (machine) { return machine.respond(true); },
  'x'    : function (box) { return box.target.Vars[box.grab_forward()]; },

  '<o' : function (box) {
    var name = box.grab_forward();
    var list = box.Object['[ox]'];
    if (!_.contains(list, name))
        list.push(name);
    box.respond(name);
    return true;
  },

  '<x=~y' : function (box) {
    var target   = box.Object;
    var orig     = box.grab_forward();
    var alias    = box.grab_forward();
    var func_def = box.grab_forward();

    box.Tokens = [
      box,
      Parse.To_Function_Call("<x=y"),
      orig,
      alias,
      box,
      Parse.To_Function_Call("<x"),
      alias,
      func_def
    ].concat(box.Tokens);

    return true;
  },

  '<x=y' : function (box) {
    var target = box.Object;
    var orig   = box.grab_forward();
    var alias  = box.grab_forward();

    var list = target[':)~ [xy]'][orig];
    if(!list)
      list = target[':)~ [xy]'][orig] = [];
    list.push(alias);
    box.respond(alias);
    return true;

  },

  '<x' : function (box) {
    var target  = box.Object;
    var name    = box.grab_forward();
    var value   = box.grab_forward();

    if (target.is_name_taken(name))
      box.throw_function_call_error('Var already created: ' + name);
    target.Vars[name]=value;

    box.respond(value);
    return true;
  },

  '<ox' : function (box) {
    var target  = box.Object;
    var name    = box.grab_forward();

    box.Tokens = [
      target,
      Parse.To_Function_Call('<o'),
      name,
      target,
      Parse.To_Function_Call('<x'),
      name,
      Parse.To_Function_Call(',')
    ].concat(box.Tokens);

    return true;
  },

  '<+?+' : function (box) {
    box.ensure_Returns_not_empty();
    if( box.is_var(box.grab_forward()) )
      box.Tokens.unshift(Parse.To_Function_Call('<++'));
    else
      box.Tokens.unshift(Parse.To_Function_Call('<x'));

    return true;
  },

  '<++:' : function (box) {
    box.ensure_both_stacks_not_empty();
    var name = box.grab_backward();
    var val  = box.grab_forward();
    if (box.is_core_var(name)) {

      if (name in box.Not_Write_Able)
        box.throw_function_call_error('core var may not be updated: ' + name)

      box.Core_Var[name] = val;
      return val;

    };

    if (!box.Vars.hasOwnProperty(name))
      box.throw_function_call_error('var does not exist yet: ' + name);

    box.Vars[name] = val;
    box.respond(val);
    return true;
  },

  '<+-' : function (box) {
    box.ensure_Returns_not_empty();
    var name = box.grab_backward();
    var val = box.read_var(name);
    delete box.Vars[name];
    box.respond(val);
    return true;
  }

}; // === fs ===============================================


o.js = {

  'modules_push' : function(mod) {
    this['Modules'].push(mod);
    return mod;
  },

  'modules_clear' : function() {
    this['Modules'] = [];
    return this['Modules'];
  },

  'is_factor_script_object' : function () {
    return true;
  },

  ensure_box_or_function: function () {
    if(this['kind'] == 'x[]x' || this['kind'] == '{}')
    return true;
    throw new Error('Programmer error: trying to spawn unknown type.');
  },

  copy_tokens : function () {
    return this.Tokens.slice();
  },

  copy: function (tokens) {
    this.ensure_box_or_function();
    tokens = (tokens) ? tokens.slice() : this.copy_tokens();
    return(new Boxs[this['kind']](tokens, this));
  },

  new_write_in_box: function (tokens) {
    var new_box = this.copy(tokens || []);
    return new_box;
  },

  new_write_out_box: function (tokens) {
    var new_box = this.copy(tokens || []);

    var o = new_box.read_var('^[]^!');
    if (!o)
      new_box.throw_function_call_error('Programmer error: No Outside.');
    new_box.write_var( '[<>]', o );
    return new_box;
  },

  'kind_is' : function (name) {
    this[name + '?']  = true;
    this['kind']      = name;
  },

  is_box : function () {
    return true;
  },

  return_backward : function (val) {
    return this.Returns.push(val);
  },

  respond : function (val) {
    if (arguments.length == 0)
      throw new Error('factor_script error: No value was given.' );
    if (arguments.length != 1)
      throw new Error('factor_script error: Only one value is allowed'  + arguments.length.toString() );
    return this.Returns.push(val);
  },

  respond_these : function (orig_arr) {
    var arr = orig_arr.slice();
    while (arr.length !== 0)
      this.respond(arr.shift());
    return arr;
  },

  is_name_taken : function (name) {
    return this.Vars.hasOwnProperty(name);
  },

  is_var : function (name) {
    if (this.is_core_var(name))
      return true;

    if (this.Vars.hasOwnProperty(name))
      return true;

    if (this.env() !== this)
      return this.env().is_var(name);

    return false;
  },

  env : function () {
    var inside = this.read_var('[<>]'),
    out = this.read_var('^[]^');

    return (!inside || inside === this || !out) ?
      this :
      out.env();
  },

  is_core_var : function (name) {
    return (_.contains(this['Core Vars'], name) && this.hasOwnProperty(name) );
  },

  read_var : function (name, if_not_found) {

    if (this.is_core_var(name))
      return this[name];

    var env = this.env();

    if (env === this) {
      if (this.Vars.hasOwnProperty(name))
        return this.Vars[name];
    };

    if (env !== this)
      return env.read_var(name, if_not_found);

    var out = this.read_var('^[]^');
    if (out)
      return out.read_var(name, if_not_found);

    return if_not_found;
  },

  write_var : function (name, val) {

    if (this.write_in || this.env() === this) {
      if (_.contains(this['Core Vars'], name) ) {
        if (_.contains(this['Not_Write_Able']))
          throw new Error('Not write able: ' + name);
        else
          this[name] = val;
      } else {
        this['Vars'][name] = val;
      };
      return val;
    };

    return this.env().write_var( name, val );

  },

  compile_forward : function () {

    this.ensure_Tokens_not_empty();
    var val = this.Tokens[0];

    if ( val && val.value == ',' ) {
      this.Tokens.shift();
      val = this.Tokens[0];
    };

    if (!val || !val['raw?'])
      return val;

    var raw = val,
    fin  = null,
    kind = raw['kind'];

    switch (kind) {

      case ':)~':
        fin = this.read_var(val.value, val);
      if(fin && (fin.is_function() || fin.kind == 'func def'))
        fin = val;
      break;

      case '()':
        var new_box = this.new_write_out_box(val.tokens);
      new_box.run();
      fin = new_box.see_backward_or_return(null);
      break;

      case '{}':
        fin = new Boxs['{}'](val, this);
      break;

      case '[]':
        fin = new Boxs[kind](val, this);
      break;

      case 'x[]x':
        fin = new Boxs[kind](val.tokens, this);
      fin.run();
      break;

    };

    if( fin === null || fin === undefined )
      throw new Error('Unknown Factor_Script raw type: ' + raw);

    this.Tokens[0] = fin;
    return fin;
  },

  see_backward_or_return: function (def) {
    if(this.Returns.length > 0)
      return this.see_backward();
    return def;
  },

  see_backward : function () {
    this.ensure_Returns_not_empty();
    return _.last(this.Returns);
  },

  see_forward : function () {
    this.compile_forward();
    this.ensure_Tokens_not_empty();
    return this.Tokens[0];
  },

  grab_backward : function () {
    this.ensure_Returns_not_empty();
    return this.Returns.pop();
  },

  grab_raw : function () {
    this.ensure_Tokens_not_empty();
    return this.Tokens.shift();
  },

  grab_forward : function (ignore_raw) {
    this.compile_forward();
    if (!ignore_raw && this.Tokens[0] && this.Tokens[0]['raw?']) {
      var new_box = this.new_write_out_box(this.Tokens);
      new_box.run(1);
      this.Tokens = new_box.Returns.concat(this.Tokens);
      return this.grab_forward();
    };
    return this.Tokens.shift();
  },

  throw_function_call_error : function (msg) {
    throw new Error(this[':)~'] + ': ' + msg);
  },

  ensure_Returns_not_empty : function (msg) {
    if (this.Returns.length == 0)
      throw new Error(this[':)~'] + ": Returns stack " + (msg || 'can\'t be empty.'));
    return true;
  },

  ensure_Tokens_not_empty : function (msg) {
    if (this.Tokens.length == 0)
      throw new Error(this[':)~'] + ": Tokens stack " + (msg || 'can\'t be empty.'));
    return true;
  },

  ensure_both_stacks_not_empty : function (msg) {
    this.ensure_Returns_not_empty(msg);
    this.ensure_Tokens_not_empty(msg);
    return true;
  },

  wrong_types : function () {
    var args = _.toArray(arguments),
    msg  = ((args[0]) ? args.shift() : "Unknown types"),
    suff = null;

    if (args.length !== 0)
      msg += ' ' + args.joing(', ');

    this.throw_function_call_error(msg);
  },

  is_applicable_func : function (func) {
    if (!func || (!func.is_function() && !func.is_func_def) )
      throw new Error('Unknown type for function: ' + func);

    if (func.is_function())
      return true;

    var back = func.backward;
    var forw = func.forward;
    if (back.names.length === 0 && forw.names.length === 0)
      return true

    return false;
  },

  run_func_if_found : function (finder) {
    var val = null;

    while( finder.next() ) {
      if (this.is_applicable_func(finder.value)) {

        val = finder.value;
        if(val.is_function())
          return val(this);

        var new_box = val['{}'].copy();
        new_box.run();

        if (new_box.Returns.length != val.returns.Tokens.length)
          this.throw_function_call_error('returning inadequate number of values: '  + h.to_string(new_box.Returns) + ' => ' + h.to_string(val.returns.Tokens) );

        var vals = _.last(new_box.Returns, val.returns.Tokens.length);
        this.respond_these(vals);

        var check_box = val.returns.copy( _.flatten( _.zip( vals, val.returns.Tokens ), true ) );
        check_box.run();

        // var returns = _.filter(check_box.Returns, function(n, i){ return i % 2 == 0; });
        if (_.isEqual( _.uniq(check_box.Returns), [true] ) )
          return true;

        this.throw_function_call_error('returned values do not match requirements: ' + h.to_string(vals) + ' => ' + h.to_string(val.returns.Tokens) );
      };

    }; // === while

    return false;
  },

  run: function (times) {

    if(this.Tokens.length == 0 || (times !== undefined && times < 1) )
      return _.last(this.Returns);

    if(times !== undefined)
      --times;

    this.token = this.grab_forward(true);

    if (!this.token[':)~?']) {
      this.Returns.push(this.token);
      return this.run(times);
    };

    this[':)~'] = this.token.value;

    // === Find function in box.
    if (false && _.last(this.Returns) != this.env() && this.env() === this) {
      this.Object = this.env();
      var finder = new Func_Finder.Box(this.Object, this[':)~']);
      if (this.run_func_if_found(finder))
        return this.run(times);
    };

    // === Find function in Object.
    if (this.Returns.length !== 0) {
      this.JS_Object = this.grab_backward();
      this.Object    = h.js_to_fs(this.JS_Object);
      var finder     = new Func_Finder.Object( this.Object, this[':)~'] );

      if (this.run_func_if_found(finder) )
        return this.run(times);

      this.return_backward(this.JS_Object);
      this.JS_Object = null;
      this.Object    = null;
    };

    // === Find function in Outside.
    // this.read_var('^[]^') != this && this.read_var('^[]^')
    if (true ) {
      finder = new Func_Finder.Box( this.env(), this[':)~'] );
      if (this.run_func_if_found(finder))
        return this.run(times);
    };

    // === Find function in Core.
    finder = new Func_Finder.Object(this.Core['Vars'], this[':)~']);
    if (this.run_func_if_found(finder)){
      return this.run(times);
    }

    throw new Error('Function not found: ' + this[':)~']);
  } // === run

}; // === js

