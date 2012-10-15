
var _       = require('underscore'),
    Parse   = require('factor_script/lib/Parse'),
    Objects = require('factor_script/lib/Objects');
    h       = require('factor_script/lib/helpers');

// ==============================================================
//                        Core
// ==============================================================
var Core = {
  'Vars' : {
    'Modules'          : [],
    'Function Aliases' : {},
    'Functions'        : {

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

      '+' : function (box) {
        var back = box.grab_backward();
        var forw = box.grab_forward();

        if (!back || !forw) 
          throw new Error('Missing args.');

        if (back.is_number() && forw.is_number()) {
          box.respond(back + forw);
          return true;
        };

        if (back['kind'] == 'list' && forw['kind'] == 'list') {
          var vals = back.Returns.concat(forw.Returns);
          box.respond(new Objects.List(vals, box));
          return true;
        };

        throw new Error('Unknown types.');
      },
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

      'is:' : function (box) {
        box.ensure_both_stacks_not_empty()
        var name  = box.grab_backward();
        var value = box.grab_forward();
        if (box['Vars'].hasOwnProperty(name))
          throw new Error('is: Var already created: ' + name);
        box['Vars'][name] = value;
        box.respond(value);
        return true;
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

    }
  }
}; // === Core


module.exports = Core;
