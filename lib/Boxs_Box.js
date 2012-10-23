var _ = require('underscore'),
h = require('factor_script/lib/helpers'),
Func_Finder = require('factor_script/lib/Func_Finder');

module.exports = {};
var o = module.exports;
o.fs = {
  '+[]+?' : function (machine) { return machine.respond(true); },
  '<+' : function (box) {
    box.ensure_Tokens_not_empty();
    var name  = box.grab_forward();
    box.ensure_Tokens_not_empty();
    var value = box.grab_forward();

    if (box.Object.kind == 'box') {
      if (box.Object.is_var(name))
        box.throw_function_call_error('Var already created: ' + name);
      if (box.Object.write_in)
        box.Object.Vars[name] = value;
      else
        box.Object.env().Vars[name] = value;
    } else {
      if (box.Object.Var.hasOwnProperty(bane))
        box.throw_function_call_error('Var already created: ' + name);
      box.Object.Vars[name]=value;
    };

    box.respond(value);
    return true;
  },

  '<+?+' : function (box) {
    box.ensure_Returns_not_empty();
    if( box.is_var(box.grab_forward()) )
      box.Tokens.unshift(Parse.To_Function_Call('<++'));
    else
      box.Tokens.unshift(Parse.To_Function_Call('<+'));

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

  'is_factor_script_object' : function () {
    return true;
  },

  spawn: function () {

    var k = this['kind'];
    switch (k) {
      case '{}':
        return this['^[]^'].spawn(this.Tokens.slice());
        break;
      case 'o[]o':
        var box = new this.klass(tokens, this);
      return box;
        break;
      default:
        throw new Error('Programmer error: trying to spawn unknown type.');
    };
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
    return this.Returns.push(val);
  },

  respond_these : function (orig_arr) {
    var arr = orig_arr.slice();
    while (arr.length !== 0)
      this.respond(arr.shift());
    return arr;
  },

  is_var : function (name) {
    if (this.is_core_var(name))
      return true;

    if (this.read_in)
      return this.Vars.hasOwnProperty(name);

    if (this.Vars.hasOwnProperty(name))
      return true;

    if (this.env() !== this)
      return this.env().is_var(name);
  },

  env : function () {
    var inside = this.read_var('[<>]'),
    out = this.read_var('^[]^');

    return (!inside || inside === this || !out) ?
      this :
      out.env();
  },

  read_write_Outside : function () {
    this.read_in = false;
    this.write_in = false;
    if (!this.read_var('^[]^'))
      this.throw_function_call_error('Programmer error: No Outside.');
    this.write_var( '[<>]', this.read_var('^[]^') );
    return true;
  },

  is_core_var : function (name) {
    return (_.contains(this['Core Vars'], name) && this.hasOwnProperty(name) );
  },

  read_var : function (name, if_not_found) {

    if (this.is_core_var(name))
      return this[name];

    if (this.read_in || this.env() === this) {
      if (this.Vars.hasOwnProperty(name))
        return this.Vars[name];
    };

    var env = this.env();
    if (env !== this)
      return env.read_var(name, if_not_found);

    var out = this.read_var('^[]^');
    if (out)
      return out.read_var(name, if_not_found);

    return if_not_found;
  },

  write_var : function (name, val) {
    if (this.write_in)
      this['Vars'][name] = val;
    else
      this.env().write_var( name, val );
    return val;
  },

  compile_forward : function () {

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
      break;

      case 'run now function':
        var new_box = this.spawn(val.tokens);
      new_box.read_write_Outside();
      new_box.run();
      fin = _.last(new_box.Returns);
      break;

      case 'function':
        fin = new Objects.Function(val, this);
      break;

      case 'list':
        fin = new Objects.List(val, this);
      break;

      case 'index':
        fin = new Objects.Index(val, this);
      break;

      case '+[]+':
        fin = new Objects.Object(val, this);
      break;

    };

    if( fin === null)
      throw new Error('Unknown Factor_Script raw type: ' + raw);

    this.Tokens[0] = fin;
    return fin;
  },

  see_backward : function () {
    return this.Returns[this.Returns.length - 1];
  },

  see_forward : function () {
    return this.compile_forward();
  },

  grab_backward : function () {
    return this.Returns.pop();
  },

  grab_raw : function () {
    return this.Tokens.shift();
  },

  grab_forward : function (ignore_raw) {
    this.compile_forward();
    if (!ignore_raw && this.Tokens[0] && this.Tokens[0]['raw?'])
      this.throw_function_call_error("next value is a function call: \"" + this.Tokens[0]['value'] + "\". Use ( ).");
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

        var new_box = val['function'].spawn();
        new_box.run();
        var vals = _.last(new_box.Returns, val.returns.Tokens.length);
        this.respond_these(vals);

        var check_box = val.returns.spawn();
        check_box.Tokens = _.flatten( _.zip( vals, val.returns.Tokens ), true );

        check_box.run();

        // var returns = _.filter(check_box.Returns, function(n, i){ return i % 2 == 0; });
        if (_.isEqual( _.uniq(check_box.Returns), [true] ) )
          return true;

        this.throw_function_call_error('returned values do not match requirements: ' + h.to_string(vals) + ' => ' + h.to_string(val.returns.Tokens) );
      };

    }; // === while

    return false;
  },

  run : function () {

    if(this.Tokens.length == 0)
      return _.last(this.Returns);

    this.token = this.grab_forward(true);

    if (!this.token[':)~?']) {
      this.Returns.push(this.token);
      return this.run();
    };

    this[':)~'] = this.token.value;

    // === Find function in box.
    if (_.last(this.Returns) != this.env() && this.read_in) {
      this.Object = this.env();
      var finder = new Func_Finder.Box(this.Object, this[':)~']);
      if (this.run_func_if_found(finder))
        return this.run();
    };

    // === Find function in Object.
    if (this.Returns.length !== 0) {
      this.JS_Object = this.grab_backward();
      this.Object    = h.js_to_fs(this.JS_Object);
      finder         = new Func_Finder.Object( this.Object, this[':)~'] );

      if (this.run_func_if_found(finder) )
        return this.run();

      this.return_backward(this.JS_Object);
      this.JS_Object = null;
      this.Object    = null;
    };

    // === Find function in Outside.
    if (!this.read_in) {
      finder = new Func_Finder.Box( this.env(), this[':)~'] );
      if (this.run_func_if_found(finder))
        return this.run();
    };

    // === Find function in Core.
    finder = new Func_Finder.Object(this.Core['Vars'], this[':)~']);
    if (this.run_func_if_found(finder)){
      return this.run();
    }

    throw new Error('Function not found: ' + this[':)~']);
  } // === run

}; // === js
