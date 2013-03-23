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

function has_new_line (str) {
  return str.indexOf( "\n" ) > -1;
};

var Blocks = {
  '('  :  [')'  , 'To_Run_Now_Function'],
  "f["  :  ["]f"  , 'To_Function'],
  '['  :  [']'  , 'To_List'],
 '{'  :  ["}" , 'To_Object'],
 '#!!!':  ['!!!', 'To_Comment'],
 '#!'  :  [ '! EOL !', 'To_Comment' ]
};

var Same_Blocks = {};
_.each(Blocks, function (v, k) {
  if( v[0] == k )
    Same_Blocks[k] = v[0];
});

var Block_Ends = {};
_.each(Blocks, function (v, k) {
  Block_Ends[v[0]] = [ k, v[1] ];
});

var Delimiters = {
  '"'  : [ '"',  'To_String',  /^"|"$/g,     /\^"/g,   /"\^/g   ],
 '&['  : [ ']&', 'To_String',  /^&\[|\]&$/g, /\^&\[/g, /\]&\^/g ]
};

var Grabs = ([
    'grab_block',
    'grab_delimiter',
    'grab_number',
    'grab_func_call'
    ]);

var Parse = function Parse (m) {
  var p = new Parser(m);
  return p.tokens;
};

var Parser = function (str) {
  this.raw    = str.split(/(\s+)/);
  this.blocks = [];
  this.describe();
  this.look_for_EOL = false;

  this.tokens = this.loop_and_grab();
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


Parser.prototype.loop_and_grab = function (until) {

  var array    = [],
      grab_i   = null,
      grab_len = Grabs.length,
      insert   = null,
      parser   = this;

  while ( !parser.ended ) {

    if (until) {
      while (!parser.ended) {
        if ( this.token === until || (this.look_for_EOL && has_new_line(this.token) ) ) {
          parser.shift();
          break;
        };
        array.push(parser.shift());
      };
      break;
    };

    grab_i = 0;

    while(grab_i < grab_len && !parser.ended) {

      if (parser.raw === '' || (parser.trim === '' && !this.look_for_EOL)) {
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

  if (b[0] === '! EOL !')
    this.look_for_EOL = true;

  if (b[1] == 'To_Comment') {
    this.loop_and_grab(b[0]);
    if (b[0] === '! EOL !')
      this.look_for_EOL = false;
    return null;
  };

  this.blocks.push(b);
  var to_raw_func = Parse[b[1]];
  return to_raw_func(this.loop_and_grab());

}; // === grab_block

Parser.prototype.end_block = function () {

  if ( has_new_line(this.token) && this.look_for_EOL ) {
    this.shift();
    this.blocks.pop();
    this.look_for_EOL = false;
    return true;
  };

  if ( !Block_Ends[this.trim] )
    return false;

  var b = this.blocks.pop();

  if ( !b ) {
    if (Same_Blocks[this.trim])
      return false;
    throw new Error('Closing unopened block: ' + this.trim);
  };

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
      if (ends_with(str, end) && str != start)
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

Parse.To_Raw = function (kind, tokens) {
  var o = {
    'raw?' : true,
    kind   : kind,
    tokens : tokens
  };

  o[kind + '?'] = true;
  return(o);
};

Parse.To_Function_Call = function (name) {
  var r = Parse.To_Raw(':)~', [name]);
  r.value = name;
  return r;
};

Parse.To_Run_Now_Function = function (arr) {
  return Parse.To_Raw('()', arr); 
};

Parse.To_Function = function (arr) {
  return Parse.To_Raw('{}', arr);
};

Parse.To_List = function (arr) {
  return Parse.To_Raw('[]', arr);
};

Parse.To_Object = function (arr) {
  return Parse.To_Raw('x[]x', arr);
};

module.exports = Parse;

Parse.Parser = Parser;




