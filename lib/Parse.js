var _       = require("underscore");

// ==============================================================
//                        Parse
// ==============================================================

function starts_with (str, sub) {
  return str.indexOf(sub) === 0;
};

function ends_with (str, sub) {
  return str.indexOf(sub, str.length - sub.length) === str.length - sub.length;
};

var Blocks = {
  "{"  :  ["}"  , 'To_Function'],
  '('  :  [')'  , 'To_Run_Now_Function'],
  '['  :  [']'  , 'To_List'],
 '~['  :  ["]~" , 'To_Index'],
 '+['  :  ["]+" , 'To_Object']
};

var Block_Ends = {};
_.each(Blocks, function (v, k) {
  Block_Ends[v[0]] = [ k, v[1] ];
});

var Delimiters = {
  '"'  : [ '"',  'To_String',  /^"|"$/g,     /\^"/g,   /"\^/g   ],
 's['  : [ ']s', 'To_String',  /^s\[|\]s$/g, /\^s\[/g, /\]s\^/g ]
};

var Grabs = ([
    'grab_block',
    'grab_delimiter',
    'grab_number',
    'grab_func_call'
    ]);

var Parse = function Parse (m) {
  var p = new Parser(m.Code);
  return p.tokens;
};

var Parser = function (str) {
  this.raw    = str.split(/(\s+)/);
  this.blocks = [];
  this.describe();

  this.tokens = this.parse();
  this.is_parsed = true;
};

Parser.prototype.describe = function () {
  this.length = this.raw.length;
  this.token  = this.raw[0];
  this.trim   = (this.token && this.token.trim());
  this.ended  = this.length === 0;

  return this.trim;
};

Parser.prototype.grab = function () {
  var val = this.shift();
  this.array.push(val);
  return true;
};

Parser.prototype.shift = function () {
  var val = this.raw.shift();
  this.describe();
  return val;
};

// ==============================================================
//                        Grabs
// ==============================================================


Parser.prototype.parse = function () {

  var array    = [],
      grab_i   = null,
      grab_len = Grabs.length,
      insert   = null,
      parser   = this;

  while ( !parser.ended ) {

    grab_i = 0;

    while(grab_i < grab_len && !parser.ended) {

      if (parser.trim === '') {
        parser.shift();
        continue;
      };

      if ( parser.end_block() ) {
        return array;
      };

      insert = parser[Grabs[grab_i]]();

      if (insert === null) {
        ++grab_i;
      } else {
        array.push(insert);
        grab_i = 0;
      };

    };
  };

  if ( this.blocks.length != 0 )
    throw new Error( 'Block not closed: ' + Block_Ends[ this.blocks.pop()[0] ] );

  return array;

}; // === parse


Parser.prototype.grab_block = function() {
  var b = Blocks[this.trim];

  if (!b)
    return null;

  this.shift();
  this.blocks.push(b);

  return Parse[b[1]](this.parse());
};

Parser.prototype.end_block = function () {
  if ( !Block_Ends[this.trim] )
    return false;

  var b = this.blocks.pop();

  if (!b)
    throw new Error('Closing unopened block: ' + this.trim);

  if (b[0] != this.trim)
    throw new Error('Closing wrong block: expected: ' + b[0] + ' actual: ' + this.trim);

  this.shift();
  return true;
};

Parser.prototype.grab_number = function() {

  var num = Number(this.trim);
  if (!_.isNumber(num) || _.isNaN(num)) {
    return null;
  };

  this.shift();
  return num;

}; // grab_number

Parser.prototype.grab_func_call = function () {
  var trim = this.trim;
  this.shift();
  return Parse.To_Function_Call(trim);
};

Parser.prototype.grab_delimiter = function () {

  var str          = null,
      start        = null,
      end          = null,
      parser       = this,
      regexp       = null,
      escape_start = null,
      escape_end   = null;

  for ( start in Delimiters ) {
    end          = Delimiters[start][0];
    regexp       = Delimiters[start][2];
    escape_start = Delimiters[start][3];
    escape_end   = Delimiters[start][4];

    if (!starts_with(parser.trim, start)) {
      str = null;
      continue;
    };

    if (parser.trim !== start && ends_with(parser.trim, end)) {
      str = parser.shift();
      break;
    };

    str = '';

    while (!parser.ended) {
      str += parser.shift();
      if (ends_with(str, end))
        break;
    };

    break;
  };


  if (str)
    return str.replace( regexp, '').replace( escape_start, start ).replace( escape_end, end );

  return null;

  // throw new Error("String already started: " + temp);
  // throw new Error("String not closed: " + str );
};


// ==============================================================
//                   To_
// ==============================================================

Parse.To_Function_Call = function (name) {
  return({ 'verb?' : true, 'value' : name });
};

Parse.To_Run_Now_Function = function (arr) {
  return ({
    'raw?'              : true,
    'run now function?' : true,
    'tokens'            : arr
  });
};

Parse.To_Function = function (arr) {
  return({
    'raw?'      : true,
    'function?' : true,
    'tokens'    : arr
  });
};

Parse.To_List = function (arr) {
  return ({
    'raw?'     : true,
    'list?'    : true,
    'tokens'   : arr
  });
};

Parse.To_Index = function (arr) {
  return ({
    'raw?'     : true,
    'index?'   : true,
    'tokens'   : arr
  });
};

Parse.To_Object = function (arr) {
  return ({
    'raw?'     : true,
    'object?'  : true,
    'tokens'   : arr
  });
};

module.exports = Parse;

Parse.Parser = Parser;




