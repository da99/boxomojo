var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp,
    script  = require("factor_script"),
    Parse   = require("factor_script/lib/Parse");

function Env(code) {
  this['stack'] = [];
  this['data']  = {};
  this['original code'] = code;
  this['code']          = code;
  this['is env?'] = true;
  return this;
};

Env.ESCAPED_QUOTE = '^';
Env.BLOCKS        = { 
  '(' : ')', 
  '{' : '}', 
  '#{' : '}', 
  'w{': '}' 
  };
Env.BLOCK_ENDS =  _.invert(Env.BLOCKS);
Env.FIND_ESCAPED_QUOTES = new RegExp( xregexp.escape( Env.ESCAPED_QUOTE ) + '"|"' +  xregexp.escape(Env.ESCAPED_QUOTE), "g"),

  
Env.prototype.run = function () {
  var tokens = this.parse();
  return this;
};

Env.prototype.var_read = function(name) {
  return this.data[name];
};

Env.prototype.parse = function () {
  return Parse(this);
}

module.exports = Env;







