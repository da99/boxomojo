var _     = require('underscore'),
    Parse = require('factor_script/lib/Parse');

var factor_script = function(func) {

  switch (func) {
    case 'To Function' :
      var f          = (arguments[1] || []);
      var o          = f.factor_script('object');
      o.nouns.push(Function_Functions);
      o['function?'] = true;
      return f;
      break;

    case 'To Run Now Function' :
      var f         = factor_script('To Function', arguments[1]);
      var o         = f.factor_script('object');
      o.run_now     = true;
      o['run now?'] = true;
      return f;
      break;

    case 'To KV List' :
      var kv        = (arguments[1] || {});
      var code      = arguments[2];
      var o         = kv.factor_script('object');
      o['kv list?'] = true;
      o.code        = code;
      if(!code)
        throw new Error('code is required');
      return kv;
      break;

    default:
      throw new Error('unknown call: ' + func_call);
  };

};

// ==============================================================
//                        Numbers
// ==============================================================

var Number_Functions = {
  'number?' : function (machine) {
    return machine.respond(true);
  }
};

var Number_Object = {
  'nouns'   : [Number_Functions],
  'number?' : true
};

Number.prototype.is_number = true;
Number.prototype.factor_script = function (func_call) {
  if (func_call == 'object')
    return Number_Object;
  return factor_script(func_call, Number_Object, arguments);
};


// ==============================================================
//                        Strings
// ==============================================================

var String_Functions = {
  'string?' : function (machine) {
    return machine.respond(true);
  }
};

var String_Object = {
  'nouns'   : [String_Functions],
  'string?' : true
};

String.prototype.is_string = true;
String.prototype.factor_script = function (func_call) {
  if (func_call === 'object')
    return String_Object;
  return factor_script(func_call, String_Object, arguments);
};


// ==============================================================
//                        Lists
// ==============================================================

var List_Functions = {
  'list?' : function (machine) { return machine.respond(true); }
};

[].constructor.prototype.is_array = true;
[].constructor.prototype.factor_script = function (func_call) {
  if (!this.factor_script_object) {
    this.factor_script_object = {
      'nouns'     : [List_Functions],
      'functions' : {},
      'list?'     : true
    };
  };

  if (func_call === 'set-box') {
    this.factor_script_object['box'] = box;
    return this.factor_script_object;
  };

  if (func_call === 'object')
    return this.factor_script_object;

  return factor_script(func_call, this.factor_script_object);
};

// ==============================================================
//                        Functions
// ==============================================================

var Function_Functions = {
  'function?' : function (m) { return m.respond(true); }
};

// ==============================================================
//                        KV Lists
// ==============================================================

var KV_List_Functions = {
  'kv list?' : function (machine) { return machine.respond(true); }
};


{}.constructor.prototype.is_object = true;
{}.constructor.prototype.factor_script = function (func_call) {

  if (!this.factor_script_object) {
    this.factor_script_object = {
      'nouns'     : [KV_List_Functions],
      'functions' : {},
      'kv list?'  : true
    };
  };

  if ( func_call === 'object')
    return this.factor_script_object;

  return factor_script(func_call, this.factor_script_object, arguments);
};


// ==============================================================
//                        Functions
// ==============================================================

(function () {}).constructor.prototype['is_function'] = true;


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

  '+' : Parse.To_Functions_List(['num+num']),
  '-' : Parse.To_Functions_List(['num-num']),
  '*' : Parse.To_Functions_List(['num*num']),
  '/' : Parse.To_Functions_List(['num/num']),

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









