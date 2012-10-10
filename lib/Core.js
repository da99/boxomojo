
var _     = require('underscore'),
    Parse = require('factor_script/lib/Parse');

// ==============================================================
//                        Core
// ==============================================================
var Core = {

  'New-Function' : function () {
    return machine.respond(factor_script('new-function'));
  };

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

  '+' : Parse.To_Function_List(['num+num']),
  '-' : Parse.To_Function_List(['num-num']),
  '*' : Parse.To_Function_List(['num*num']),
  '/' : Parse.To_Function_List(['num/num']),

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
      )

}; // Core


