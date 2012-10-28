var _              = require('underscore'),
Parse              = require('factor_script/lib/Parse'),
Core               = require('factor_script/lib/Core'),
Boxs_Box           = require('factor_script/lib/Boxs_Box'),
Boxs_Function      = require('factor_script/lib/Boxs_Function'),
Boxs_Function_Call = require('factor_script/lib/Boxs_Function_Call'),
Boxs_List          = require('factor_script/lib/Boxs_List'),
Boxs_Number        = require('factor_script/lib/Boxs_Number'),
Boxs_String        = require('factor_script/lib/Boxs_String');

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
  String.prototype['fs_box'] = function () { return Boxs['~~~']; };
  Number.prototype['is_number']                         = function () { return !isNaN(this + 0); };
  Number.prototype['fs_box'] = function () { return Boxs['#']; };
};


var Boxs = {
  'JS_Modules' : [],
  'Modules'    : []
};

Core.init(Boxs);
Boxs_Box.init(Boxs);

// ==============================================================
//                        Boxs
// ==============================================================

Boxs['x[]x'] = function (code_or_tokens, outside, kind) {

  if (!kind)
    kind = 'x[]x';

  var js_kind_mod = Boxs['JS_Modules'][kind],
      js_base_mod = Boxs['JS_Modules']['x[]x'];
      fs_mod      = Boxs['Modules'][kind];
  var o           = Object.create((js_kind_mod) ? _.extend({}, js_base_mod, js_kind_mod) : js_base_mod);

  o['Modules']     = [];
  o['Module Boxs'] = [];

  o['Returns'] = [];
  o['Vars']    = {};

  o['[ox]']             = [];
  o[':)~ [xy]'] = {};
  o['Function Befores'] = {};
  o['Function Afters']  = {};
  o['Function Wraps']   = {};

  o['Temp Stacks'] = {};

  o['kind']        = 'object';
  o['object kind'] = null;

  o['Core']           = Boxs['Modules'] && Boxs['Modules']['Core'];
  o['Core Vars']      = ['oo', '~~', '[<>]', '[<>]!', '^[]^', '^[]^!'];
  o['Not_Write_Able'] = ['[<>]!', '^[]^!'];

  o['kind']     = kind;
  o[kind + '?'] = true;

  o['oo']       = o;
  o['~~']       = o;

  o['[<>]']     = o;
  o['[<>]!']    = o;

  o['^[]^']     = outside;
  o['^[]^!']    = outside;

  var box_mod = Boxs['Modules']['x[]x'];
  if (box_mod)
    o.modules_push( box_mod );

  if (fs_mod && fs_mod != box_mod)
    o.modules_push( fs_mod );

  if (code_or_tokens && code_or_tokens.is_array()) {
    o.Tokens = code_or_tokens;
    o.Code   = null;
  } else {
    o.Code = code_or_tokens;
    o.Tokens = (code_or_tokens && Parse(code_or_tokens));
  };

  return o;
};

// ==============================================================
//                        Modules
// ==============================================================

Boxs['[{}...]'] = function (funcs) {
  if(!funcs)
    throw new Error('funcs are required.');
  var mod        = Boxs['x[]x'](null, null, '[{}...]');
  var o          = Boxs['x[]x'](null, null, '[{}...]');
  o['Vars'] = funcs;
  mod['Vars']    = o;
  return mod;
};


Boxs['JS_Modules'] = {
  '#'    : Boxs_Number.js,
  '~~~'  : Boxs_String.js,
  ':)~'  : Boxs_Function_Call.js,
  '{}'   : Boxs_Function.js,
  '[]'   : Boxs_List.js,
  'x[]x' : Boxs_Box.js
};

Boxs['Modules'] = {
  '#'    : null,
  '~~~'  : null,
  ':)~'  : new Boxs['[{}...]'](Boxs_Function_Call.fs),
  '{}'   : new Boxs['[{}...]'](Boxs_Function.fs),
  '[]'   : new Boxs['[{}...]'](Boxs_List.fs),
  'x[]x' : new Boxs['[{}...]'](Boxs_Box.fs),
  'Core' : new Boxs['[{}...]'](Core)
};

Boxs['Modules']['Core'].modules_clear();

// ==============================================================
//                        Numbers
// ==============================================================

Boxs['#'] = (function () {
  var o = new Boxs['x[]x'](null, null, '#');
  o['Vars'] = Boxs_Number.fs;
  return o;
})();


// ==============================================================
//                        Strings
// ==============================================================

Boxs['~~~'] = (function () {
  var o = new Boxs['x[]x'](null, null, '~~~');
  o['Vars'] = Boxs_String.fs;
  return o;
})();


// ==============================================================
//                        Function Calls
// ==============================================================

Boxs[':)~'] = function (tokens, box) {
  var o = new Boxs['x[]x'](tokens, box, ':)~');
  return( o );
};

// ==============================================================
//                        Functions
// ==============================================================

Boxs['{}'] = function (raw, box) {
  var o = new Boxs['x[]x'](raw.tokens, box, '{}');
  o['klass'] = Boxs['{}'];
  return o;
};



// ==============================================================
//                        Lists
// ==============================================================

Boxs['[]'] = function (unk, box) {

  var returns = [], tokens = [];

  if(unk && unk.tokens)
    tokens = unk.tokens;
  else if (unk && unk.is_array())
    returns = unk;
  else
    throw new Error('Unknown type: ' + unk);

  var o = new Boxs['x[]x'](tokens, box, '[]');
  o['klass'] = Boxs['[]'];
  o.Returns = returns;
  o.run();

  return o;
};



// ==============================================================
//                        To_ Functionality
// ==============================================================



module.exports = Boxs;

