var _          = require('underscore');
var Var_Finder = require('factor_script/lib/Var_Finder');

if (!Object.prototype.is_factor_script_object) {
  Object.prototype.is_factor_script_object = function () {
    return false;
  };
};

var Objects = { };

Objects.base = { 

  'is_factor_script_object' : function () {
    return true;
  },

  value : function () {
    return this.Vars['value'];
  },

  create : function(name, val) {
    this.Vars[name] = val;
    return val;
  },

  read : function(name) {
    return Var_Finder.Factor_Script_Object(this, name);
  },

  read_verb : function(name) {
    return Var_Finder.Factor_Script_Object(this, name, true);
  },

  update : function(name, val) {
    this.Vars[name] = val;
    return val;
  },

  delete : function (name) {

    if (this.Vars.hasOwnProperty(name)) {
      delete this.Vars[name];
      return true;
    };

    return false;
  }

  'set-box' : function (box) {
    this.Outside = box;
    return box;
  }

}; // === var object_core

var Base = function () {
  var o               = Object.create(Objects.base);
  o.Returns           = [];
  o.Vars              = {};
  o['Function Lists'] = [];
  o['Functions']      = {};
  return o
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


// ==============================================================
//                        Lists
// ==============================================================

var List_Functions = {
  'list?' : function (machine) { return machine.respond(true); }
};

[].constructor.prototype.factor_script = function (func_call) {
  if (!this.factor_script_object) {
    this.factor_script_object = {
      'nouns'     : [List_Functions],
      'functions' : {},
      'list?'     : true
    };
  };


  return factor_script(func_call, this.factor_script_object);
};

Objects.List = function () {
  var o = new Base();
};

// ==============================================================
//                        Functions
// ==============================================================

var Function_Functions = {
  'function?' : function (m) { return m.respond(true); }
};

Objects.Function = function () {
  var o = new Base();
};

// ==============================================================
//                        KV Lists
// ==============================================================

var KV_List_Functions = {
  'kv list?' : function (machine) { return machine.respond(true); }
};


({}).constructor.prototype.is_object = true;
({}).constructor.prototype.factor_script = function (func_call) {

  if (func_call === 'compile raw') {
    if (!this['raw'])
      return this;

  };

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

Objects.KV_List = function () {
  var o = new Base();
};



// ==============================================================
//                        Functions
// ==============================================================

var f_proto = (function () {}).constructor.prototype;
if (!f_proto['is_function']) {
  f_proto['is_function'] = true;
};



// ==============================================================
//                        To_ Functionality
// ==============================================================


var Parse = {};
Parse.To_Anon_Function = function (js) {
  var f          = (js || []);
  var o          = f.factor_script('object');
  o.nouns.push(Function_Functions);
  o['function?'] = true;
  return f;
  // Parse.To_Function = function (back, forth, returns, func) {
  // };
  // return({
    // 'backward'    : Parse.To_Function_Args(back),
    // 'forward'     : Parse.To_Function_Args(forth),
    // 'returns'     : Parse.To_Function_Args(returns),
    // 'javascript?' : true,
    // 'function'    : func
  // });
};

Parse.To_Function_List = function (arr) {
  return arr;
};

Parse.To_Run_Now_Function = function (js) {
  var f         = Parse.To_Function(js);
  var o         = f.factor_script('object');
  o.run_now     = true;
  o['run now?'] = true;
  return f;
};

Parse.To_KV_List = function (js) {
  var kv        = (arguments[1] || {});
  var code      = arguments[2];
  var o         = kv.factor_script('object');
  o['kv list?'] = true;
  o.code        = code;
  if(!code)
    throw new Error('code is required');
  return kv;
};


Parse.To_Function_Args = function (arr) {
  if(arr.length % 2 !== 0)
    throw new Error('Uneven number of args: ' + arr);
  var new_arr = [];
  _.each(arr, function (e, i, l) {
    if(i % 2 === 0)
    new_arr.push(e);
    else
    new_arr.push(Parse.Verb(e));
  }) ;

  return new_arr;
};


module.exports = Objects;

