var _          = require('underscore');

if (!Object.prototype.is_factor_script_object) {

  // === Yes. I wrote the following.
  // === No, I am not crazy.
  Object.prototype.is_factor_script_object = function () { return false; };
  Object.prototype['is_function']          = function () { return false; };
  Object.prototype['is_array']             = function () { return false; };
  Object.prototype['is_string']            = function () { return false; };
  Object.prototype['is_number']            = function () { return false; };

  (function () {}).constructor.prototype['is_function'] = function () { return true; };
  ([]).constructor.prototype['is_array']                = function () { return true; };
  String.prototype['is_string']                         = function () { return true; };
  Number.prototype['is_number']                         = function () { return !isNaN(this + 0); };

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
  },

  'set-box' : function (box) {
    this.Outside = box;
    return box;
  }

}; // === var object_core

Objects.init = function (o) {
  o['Returns']          = [];
  o['Vars']             = {};
  o['Modules']          = [];
  o['Module Boxs']      = [];
  o['Functions']        = {};
  o['Function Aliases'] = {};
  o['Function Befores'] = {};
  o['Function Afters']  = {};
  o['Function Wraps']   = {};
  o['Temp Stacks']      = {};
  return o;
};

var Base = function (tokens, box, klass, f_list) {
  var o                 = Object.create(Objects.base);

  Objects.init(o);

  if ( f_list )
    o['Modules'].push(f_list);

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

var Number_Functions = {'Vars' : {} };
Objects.init(Number_Functions['Vars']);
Number_Functions['Vars']['Functions'] = {
  'number?' : function (machine) {
    return machine.respond(true);
  }
};

Objects['Number'] = new Base(null, null, 'number', Number_Functions);


// ==============================================================
//                        Strings
// ==============================================================

var String_Functions = { 'Vars' : {} };
Objects.init(String_Functions['Vars']);
String_Functions['Vars']['Functions'] = {
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
//                        Indexes
// ==============================================================

var Index_Functions = {
  'index?' : function (machine) { return machine.respond(true); },
  'get'    : function (machine) { return machine.target.Vars[machine.grab_forward()]; }
};


Objects['Index'] = function (tokens, box) {
  var o = new Base(tokens, box, 'index', Index_Functions);
  return o;
};


// ==============================================================
//                        Objects
// ==============================================================

var Object_Functions = {
  'object?' : function (machine) { return machine.respond(true); }
};


Objects['Object'] = function (tokens, box) {
  var o = new Base(tokens, box, 'object', Object_Functions);
  return o;
};


// ==============================================================
//                        To_ Functionality
// ==============================================================

Objects.js_to_fs = function (o) {
  if (!o)
    return o;

  if (o.is_number()) 
    return Objects['Number'];
  else if (o.is_string()) 
    return Objects['String'];
  else
    return o;
};


module.exports = Objects;

