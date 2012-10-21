var _          = require('underscore'),
Core_Modules   = require('factor_script/lib/Core_Modules');

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

  spawn: function () {
    var k = this['kind'];
    switch (k) {
      case 'function':
        return this.Outside.spawn(this.Tokens.slice());
        break;
      default:
        throw new Error('Programmer error: trying to spawn unknown type.');
    };
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
  o['kind']             = 'object';
  return o;
};

Objects.init_module = function (funcs) {
  if(!funcs)
    throw new Error('funcs are required.');
  var o = { 'Vars' : {} }
  Objects.init(o['Vars']);
  o['Vars']['Functions'] = funcs;
  o['object kind'] = 'module';
  return o;
};

Objects.Numbers_Mod        = Objects.init_module(Core_Modules.Numbers);
Objects.Function_Calls_Mod = Objects.init_module(Core_Modules.Function_Calls);
Objects.Functions_Mod      = Objects.init_module(Core_Modules.Functions);
Objects.Strings_Mod        = Objects.init_module(Core_Modules.Strings);
Objects.Lists_Mod          = Objects.init_module(Core_Modules.Lists);
Objects.Indexs_Mod         = Objects.init_module(Core_Modules.Indexs);
Objects.Objects_Mod        = Objects.init_module(Core_Modules.Objects);

var Base = function (tokens, box, klass, f_list, target) {
  var o = Object.create(Objects.base);

  Objects.init(o);

  if (target)
    o['klass'] = target.constructor;

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

Objects['Number'] = new Base(null, null, 'number', Objects.Numbers_Mod);


// ==============================================================
//                        Strings
// ==============================================================

Objects['String'] = new Base(null, null, 'string', Objects.Strings_Mod);


// ==============================================================
//                        Function Calls
// ==============================================================

Objects.Function_Call = function (tokens, box) {
  return( new Base(tokens, box, 'function call', Objects.Function_Calls_Mod) );
};

// ==============================================================
//                        Functions
// ==============================================================

Objects['Function'] = function (raw, box) {
  var o = new Base(raw.tokens, box, 'function', Objects.Functions_Mod, this);
  return o;
};



// ==============================================================
//                        Lists
// ==============================================================


Objects.List = function (raw, box) {
  var o = new Base(raw, box, 'list', Objects.Lists_Mod, this);
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


Objects['Index'] = function (raw, box) {
  var new_box = box.spawn(raw.tokens);
  var o = new Base(raw.tokens, box, 'index', Objects.Indexs_Mod);
  o.Vars = new_box.Vars;
  new_box.run();
  return o;
};


// ==============================================================
//                        Objects
// ==============================================================


Objects['Object'] = function (raw, box) {
  var new_box = box.spawn(raw.tokens);
  new_box.run();
  var o = new Base(raw.tokens, box, 'object', Objects.Objects_Mod);
  o.Vars = new_box.Vars;
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

