
var _       = require('underscore'),
    Parse   = require('factor_script/lib/Parse'),
    h       = require('factor_script/lib/helpers');

var func_args = function (fs_func, box) {
  var tokens = fs_func.copy_tokens(), len = fs_func.Tokens.length;
  if ((len % 2) !== 0)
    box.throw_function_call_error('Uneven number of parameters.');

  var desc = { names: [] }, name = null;
  desc['{}'] = fs_func;

  // === Grab names of arguments;
  var i = -2;
  while ( (i += 2) < len )  {
    name = tokens[i];
    if (!_.isString(name))
      box.throw_function_call_error('Name of argument must be a string: ' + name);
    desc['names'].push(name);
  };
  return desc;
};

// ==============================================================
//                        Core
// ==============================================================
var Core = {

  'string?' : function (box) {
    box.ensure_Returns_not_empty();
    box.respond(_.isString(box.grab_backward()));
    return true;
  },

  'run': function (box) {
    box.ensure_Tokens_not_empty();
    var fs_func = box.grab_forward();
    if (!fs_func['{}?']) {
      box.Tokens.unshift(fs_func);
      return false;
    };

    var new_box = box.spawn(fs_func.Tokens);
    new_box.Vars = box.Vars;
    new_box.run();
    if (new_box.Returns.length > 0)
      box.respond(_.last(new_box.Returns));
    return true;
  },

  '<_' : function (box) {
    box.ensure_Returns_not_empty();
    var prev = box.see_backward();
    return box.respond(prev);
  },

  '_>' : function (box) {
    box.ensure_Tokens_not_empty();
    var next = box.see_forward();
    return box.respond(next);
  },

  'copy_able' : function(machine) {
    machine.grab_backward();
    return machine.respond(false);
  },

  'yes/no?'   : function (machine) {
    if (machine.Returns.length == 0)
      return machine.respond(false);
    return machine.respond(machine.grab_backward() === true);
  },

  'anything?' : function (box) {
    if (box.Returns.length == 0)
      return box.respond(false);
    box.grab_backward();
    return box.respond(true);
  },

  ',' : function (box) {
    if ( box.Tokens.length == 0 )
      throw new Error( ',: Nothing found after: ,' );

    return true;
  },

  'When var is missing:' : function () {
    throw new Error("missing_var: " + _.toArray(arguments) );
  },

  // ==============================================================
  //                        Hash functions:
  //
  // NOTE: Keys are in strings. Need to be
  //       typed cast to Factor_Script strings
  //       when reading keys.
  // ==============================================================

  '=' : function (box) {
    box.ensure_both_stacks_not_empty();
    var name  = box.grab_backward();

    box.Tokens = [
      Parse.To_Function_Call('[<>]'),
      Parse.To_Function_Call('<+'),
      name,
      Parse.To_Function_Call(',')
    ].concat(box.Tokens);

    return true;
  },

  'keys' : function (mess) {
    var h = mess.env.grab_backward();
    if (k.is_w_list)
      var arr = [];
    for (i in h.vars() ) {
      arr.push( Parse.new_string(i) );
    };
    return arr;
    return {'is runtime instruction?': true, 'instruction': 'super' };
  },

  'key-of' : function (mess) {
    var h = mess.env.grab_backward(),
    v = mess.env.grab_forward(),
    target = undefined;
    for (i in h) {
      if ( h[i] === v ) {
        target = Parse.new_string(i);
        break;
      };
    };

    return target;
  },

  'get' : function (box) {
    box.ensure_Tokens_not_empty();
    var name = box.grab_forward();
    if (box.Vars.hasOwnProperty(name)) {
      box.respond(box.Vars[ name ]);
      return true;
    };
    box.throw_function_call_error('var does not exist: ' + name);
  },


  '<=+=<' : function (box) {
    box.ensure_both_stacks_not_empty();
    var orig   = box.grab_backward();
    var alias  = box.grab_forward();

    box.ensure_Returns_not_empty();
    var target = Objects.js_to_fs(box.grab_backward());

    var list = target['Function Aliases'][orig];
    if(!list)
      list = target['Function Aliases'][orig] = [];
    list.push(alias);
    box.respond(alias);
    return true;

  },

  '][' : function (box) {
    box.ensure_both_stacks_not_empty();
    var target = box.grab_backward();
    var list   = box.grab_forward();
    if (!target.Tokens)
      box.throw_function_call_error('wrong kind of box: ' + box.kind);
    if (!list.Returns)
      box.throw_function_call_error('wrong kind of box: ' + list.kind);
    target.Tokens = target.Tokens.concat(list.Returns);
    box.respond(target);
    return true;
  },

  '<+[' : function (box) {
    var target = Objects.js_to_fs(box.grab_backward()),
    ret        = box.grab_forward(),
    name       = box.grab_forward(),
    tok        = box.grab_forward(),
    fin        = box.grab_forward(),
    fsfunc     = box.grab_forward(),
    end        = box.grab_raw();

    if (!ret || !name || !tok || !fin || !fsfunc || !end ) {
      throw new Error('Missing values.');
    };

    if ( end.value !== ']+>' ) {
      box.throw_function_call_error('typo: ' + end.value);
    };

    var funcs    = target['Functions'];
    var old_func = funcs[name];
    if (old_func)
      throw new Error(box[':)~'] + ': function already exists: ' + name);

    funcs[name] = {
      backward   : func_args(ret, box),
      forward    : func_args(tok, box),
      returns    : fin,
      kind       : 'func def',
      'func def?': true, 
      is_func_def: true,
      '{}' : fsfunc
    };

    box.respond(name);
    return true;
  }

}; // === Core


module.exports = Core;

