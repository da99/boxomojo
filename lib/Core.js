
var _     = require('underscore'),
    Parse = require('factor_script/lib/Parse');

// ==============================================================
//                        Core
// ==============================================================
var Core = {

  'New-Function' : function () {
    return machine.respond(factor_script('new-function'));
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

  'anything?' : function (machine) {
    if (machine.Returns.length == 0)
      return machine.respond(false);
    machine.grab_backward();
    return machine.respond(true);
  },

  '+' : (['num+num']),
  '-' : (['num-num']),
  '*' : (['num*num']),
  '/' : (['num/num']),

  'num+num' : Parse.To_Function(
      [ 'left',  'number?' ],
      [ 'right', 'number?' ],
      [ '_',     'number?' ],
      function(local, outer) {
        return left + right;
      }
      ),

  'num-num' : Parse.To_Function(
      [ 'left',  'number?' ],
      [ 'right', 'number?' ],
      [ '_',     'number?' ],
      function(local, outer) {
        return left - right;
      }
      ),

  'num*num' : Parse.To_Function(
      [ 'left',  'number?' ],
      [ 'right', 'number?' ],
      [ '_', 'number?' ],
      function(local, outer) {
        return left * right;
      }
      ),

  'num/num' : Parse.To_Function(
      [ 'left',  'number?' ],
      [ 'right', 'number?' ],
      [ '_', 'number?' ],
      function(local, outer) {
        return left / right;
      }
      ),

  'is:' : function (mess) {
    var name = mess.env.grab_backward(),
    value = mess.env.grab_forward();
    return mess.env.var_create( name, value );
  },

  ',' : function (mess) {
    var v = mess.env.grab_forward();
    if ( !v )
      throw new Error( ',: Nothing found after: ,' );
    return v;
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
  }

}; // Core


