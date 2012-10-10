var _     = require('underscore');

var factor_script = function(func) {
  switch (func) {
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









