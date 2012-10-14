var _          = require('underscore');

if (!Object.prototype.is_factor_script_object) {

  Object.prototype.is_factor_script_object = function () { return false; };
  Object.prototype['is_function']          = function () { return false; };
  Object.prototype['is_array']             = function () { return false; };
  Object.prototype['is_string']            = function () { return false; };
  Object.prototype['is_number']            = function () { return false; };

  (function () {}).constructor.prototype['is_function'] = function () { return true; };
  ([]).constructor.prototype['is_array']                = function () { return true; };
  String.prototype['is_string']                         = function () { return true; };
  Number.prototype['is_number']                         = function () { return true; };

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

var Base = function (tokens, box, klass, f_list) {
  var o                 = Object.create(Objects.base);
  o['Returns']          = [];
  o['Vars']             = {};
  o['Modules']   = ([f_list] || []);
  o['Functions']        = {};
  o['Function Aliases'] = {};
  o['Function Befores'] = {};
  o['Function Afters']  = {};
  o['Function Wraps']   = {};
  o['Temp Stacks']      = {};

  if (tokens)
    o.Tokens  = tokens;
  if (box)
    o.Outside = box;
  if (klass) {
    o[klass + '?'] = true;
    o['kind'] = klass;
  };

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

Objects['Number'] = new Base(null, null, 'number', Number_Functions);


// ==============================================================
//                        Strings
// ==============================================================

var String_Functions = {
  'string?' : function (machine) {
    return machine.respond(true);
  }
};

Objects['String'] = new Base(null, null, 'string', String_Functions);


// ==============================================================
//                        Function Calls
// ==============================================================

var Function_Call_Functions = {
  'function call?' : function (box) { return box.respond(true); },
};

Objects.Function_Call = function (raw, box) {
  return( new Base(null, null, 'function call', Function_Call_Functions) );
};

// ==============================================================
//                        Functions
// ==============================================================

var Function_Functions = {
  'function?' : function (m) { return m.respond(true); }
};

Objects['Function'] = function () {
  var o = new Base(tokens, box, 'function', Function_Functions);
  return o;
};



// ==============================================================
//                        Lists
// ==============================================================

var List_Functions = {
  'list?' : function (machine) { return machine.respond(true); }
};

Objects.List = function (raw, box) {
  var o = new Base(raw, box, 'list', List_Functions);
  return o;
};



// ==============================================================
//                        KV Lists
// ==============================================================

var KV_List_Functions = {
  'kv list?' : function (machine) { return machine.respond(true); }
};


Objects['KV_List'] = function (tokens, box) {
  var o = new Base(tokens, box, 'kv list', KV_List_Functions);
  return o;
};



// ==============================================================
//                        To_ Functionality
// ==============================================================



module.exports = Objects;

