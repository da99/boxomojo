var _              = require('underscore'),
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
  Number.prototype['is_number']                         = function () { return !isNaN(this + 0); };

};


var Boxs = {};

// ==============================================================
//                        Modules
// ==============================================================

Boxs['[{}...]'] = function (funcs) {
  if(!funcs)
    throw new Error('funcs are required.');
  var mod        = Box['o[]o'](null, null, '[{}...]');
  var o          = Box['o[]o'](null, null, '[{}...]');
  mod['Vars']    = o;
  o['Functions'] = funcs;
  return mod;
};


Boxs['JS_Modules'] = {
  '#'    : Boxs_Number.js,
  ':)~'  : Boxs_Function_Call.js,
  '{}'   : Boxs_Function.js,
  '~~~'  : Boxs_String.js,
  '[]'   : Boxs_List.js,
  'u[]u' : Boxs_Index.js,
  'o[]o' : Boxs_Box.js
};

Boxs['Modules'] = {
  '#'    : new Boxs['[{}...]'](Boxs_Number.fs),
  ':)~'  : new Boxs['[{}...]'](Boxs_Function_Call.fs),
  '{}'   : new Boxs['[{}...]'](Boxs_Function.fs),
  '~~~'  : new Boxs['[{}...]'](Boxs_String.fs),
  '[]'   : new Boxs['[{}...]'](Boxs_List.fs),
  'u[]u' : new Boxs['[{}...]'](Boxs_Index.fs),
  'o[]o' : new Boxs['[{}...]'](Boxs_Box.fs)
};


// ==============================================================
//                        Boxs
// ==============================================================

Boxs['o[]o'] = function (code_or_tokens, outside, kind) {

  var js_mod = _.combine(Box['JS_Modules']['o[]o'], Boxs['JS_Modules'][kind]);
  var o      = Object.create(js_mod);

  o.modules_push( Boxs['Modules'][kind] );

  if (code_or_tokens && code_or_tokens.is_array()) {
    o.Tokens = tokens;
    o.Code   = null;
  } else {
    o.Code = code_or_tokens;
    o.Tokens = (code_or_tokens && Parse(code_or_tokens));
  };

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

  o['kind']           = 'object';
  o['object kind']    = null;

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

  o.run();
  return o;
};

// ==============================================================
//                        Numbers
// ==============================================================

Boxs['#'] = (function () {
  var o = new Boxs['o[]o'](null, null, '#');
  return o;
})();


// ==============================================================
//                        Strings
// ==============================================================

Boxs['~~~'] = (function () {
  var o = new Boxs['o[]o'](null, null, '~~~');
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

Boxs.js_to_fs = function (o) {
  if (!o)
    return o;

  if (o.is_number())
    return Boxs['#'];
  else if (o.is_string())
    return Boxs['~~~'];
  else
    return o;
};


Boxs['Base'] = Base;
module.exports = Objects;

