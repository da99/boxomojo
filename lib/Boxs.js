var _              = require('underscore'),
Parse              = require('factor_script/lib/Parse'),
Core               = require('factor_script/lib/Core'),
Boxs_Box           = require('factor_script/lib/Boxs_Box'),
Boxs_Function      = require('factor_script/lib/Boxs_Function'),
Boxs_Function_Call = require('factor_script/lib/Boxs_Function_Call'),
Boxs_Index         = require('factor_script/lib/Boxs_Index'),
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


// ==============================================================
//                        Boxs
// ==============================================================

Boxs['o[]o'] = function (code_or_tokens, outside, kind) {

  if (!kind)
    kind = 'o[]o';

  var js_kind_mod = Boxs['JS_Modules'][kind],
      js_base_mod = Boxs['JS_Modules']['o[]o'];
      fs_mod      = Boxs['Modules'][kind];
  var o           = Object.create((js_kind_mod) ? _.extend({}, js_base_mod, js_kind_mod) : js_base_mod);

  o['Modules']             = [];
  o['Module Boxs']         = [];
  o['Private Modules']     = [];
  o['Private Module Boxs'] = [];

  o['Returns']             = [];
  o['Vars']                = {};

  o['Functions']           = {};
  o['Function Aliases']    = {};
  o['Function Befores']    = {};
  o['Function Afters']     = {};
  o['Function Wraps']      = {};

  o['Temp Stacks']         = {};

  o['kind']           = 'object';
  o['object kind']    = null;

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

  if (fs_mod)
    o.modules_push( fs_mod );

  if (code_or_tokens && code_or_tokens.is_array()) {
    o.Tokens = tokens;
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
  var mod        = Boxs['o[]o'](null, null, '[{}...]');
  var o          = Boxs['o[]o'](null, null, '[{}...]');
  mod['Vars']    = o;
  o['Functions'] = funcs;
  return mod;
};


Boxs['JS_Modules'] = {
  '#'    : Boxs_Number.js,
  '~~~'  : Boxs_String.js,
  ':)~'  : Boxs_Function_Call.js,
  '{}'   : Boxs_Function.js,
  '[]'   : Boxs_List.js,
  'u[]u' : Boxs_Index.js,
  'o[]o' : Boxs_Box.js
};

Boxs['Modules'] = {
  '#'    : null,
  '~~~'  : null,
  ':)~'  : new Boxs['[{}...]'](Boxs_Function_Call.fs),
  '{}'   : new Boxs['[{}...]'](Boxs_Function.fs),
  '[]'   : new Boxs['[{}...]'](Boxs_List.fs),
  'u[]u' : new Boxs['[{}...]'](Boxs_Index.fs),
  'o[]o' : new Boxs['[{}...]'](Boxs_Box.fs),
  'Core' : new Boxs['[{}...]'](Core)
};


// ==============================================================
//                        Numbers
// ==============================================================

Boxs['#'] = (function () {
  var o = new Boxs['o[]o'](null, null, '#');
  o['Functions'] = Boxs_Number.fs;
  return o;
})();


// ==============================================================
//                        Strings
// ==============================================================

Boxs['~~~'] = (function () {
  var o = new Boxs['o[]o'](null, null, '~~~');
  o['Functions'] = Boxs_String.fs;
  return o;
})();


// ==============================================================
//                        Function Calls
// ==============================================================

Boxs[':)~'] = function (tokens, box) {
  var o = new Boxs['o[]o'](tokens, box, ':)~');
  return( o );
};

// ==============================================================
//                        Functions
// ==============================================================

Boxs['{}'] = function (raw, box) {
  var o = new Boxs['o[]o'](raw.tokens, box, '{}');
  o['klass'] = Boxs['{}'];
  return o;
};



// ==============================================================
//                        Lists
// ==============================================================

Boxs['[]'] = function (unk, box) {

  var tokens = (unk.tokens) ? unk.tokens : [];

  var o = new Boxs['o[]o'](tokens, box, '[]');
  o['klass'] = Boxs['[]'];

  if( tokens.length === 0 && unk.is_array() )
    o.Returns = tokens;
  else
    o.run();

  return o;
};



// ==============================================================
//                        Indexes
// ==============================================================


Boxs['u[]u'] = function (raw, out) {
  var o = new Boxs['o[]o'](raw.tokens, out, '[]');
  o.run();
  return o;
};



// ==============================================================
//                        To_ Functionality
// ==============================================================



module.exports = Boxs;

