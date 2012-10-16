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

Objects.init_module = function (funcs) {
  var o = { 'Vars' : {} }
  Objects.init(o['Vars']);
  o['Vars']['Functions'] = funcs;
  return o;
};

var Base = function (tokens, box, klass, f_list) {
  var o = Object.create(Objects.base);

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

var Number_Functions = Objects.init_module({

  'number?' : function (box) {
    return box.respond(true);
  },

  '+' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back + forw);
    return true;
  },

  '-' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back - forw);
    return true;
  },

  '*' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back * forw);
    return true;
  },

  '/' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back / forw);
    return true;
  },

  '/.' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back % forw);
    return true;
  }


});

Objects['Number'] = new Base(null, null, 'number', Number_Functions);


// ==============================================================
//                        Strings
// ==============================================================

var String_Functions = Objects.init_module({
  'string?' : function (machine) { return machine.respond(true); }
});

Objects['String'] = new Base(null, null, 'string', String_Functions);


// ==============================================================
//                        Function Calls
// ==============================================================

var Function_Call_Functions = Objects.init_module({
  'function call?' : function (box) { return box.respond(true); },
});

Objects.Function_Call = function (raw, box) {
  return( new Base(raw, box, 'function call', Function_Call_Functions) );
};

// ==============================================================
//                        Functions
// ==============================================================

var Function_Functions = Objects.init_module({
  'function?' : function (m) { return m.respond(true); }
});

Objects['Function'] = function (raw, box) {
  var o = new Base(raw, box, 'function', Function_Functions);
  return o;
};



// ==============================================================
//                        Lists
// ==============================================================

var List_Functions = Objects.init_module({ 
  'list?' : function (machine) { return machine.respond(true); },
  '+' : function (box) {
    box.ensure_Tokens_not_empty();

    var forw = box.grab_forward();
    if (forw['kind'] !== 'list') {
      return false;
    };

    var back = box.JS_Object;
    var vals = back.Returns.concat(forw.Returns);
    box.respond(new Objects.List(vals, box));
    return true;
  }
});

Objects.List = function (raw, box) {
  var o = new Base(raw, box, 'list', List_Functions);
  if (_.isArray(raw)) {
    o.Returns = raw;
  } else {
    var new_box = box.spawn(raw.tokens);
    o.Returns = new_box.Returns;
    new_box.run();
  };
  return o;
};



// ==============================================================
//                        Indexes
// ==============================================================

var Index_Functions = {
  'index?' : function (machine) { return machine.respond(true); },
  'get'    : function (machine) { return machine.target.Vars[machine.grab_forward()]; }
};


Objects['Index'] = function (raw, box) {
  var new_box = box.spawn(raw.tokens);
  var o = new Base(raw.tokens, box, 'index', Index_Functions);
  o.Vars = new_box.Vars;
  new_box.run();
  return o;
};


// ==============================================================
//                        Objects
// ==============================================================

var Object_Functions = {
  'object?' : function (machine) { return machine.respond(true); }
};


Objects['Object'] = function (raw, box) {
  var new_box = box.spawn(raw.tokens);
  var o = new Base(raw.tokens, box, 'object', Object_Functions);

  new_box.Vars = o.Vars;
  new_box.run();
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


Objects['Base'] = Base;
module.exports = Objects;

