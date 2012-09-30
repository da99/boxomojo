var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp;


module.exports = script = { 
  ESCAPED_QUOTE: '^' ,
  New: function (code) {
    var original_code = code;
    this["original code"] = function () { return original_code; };
    this["code"]          = function () { return code; };
    this["is a factor script?"] = function () { return true; }
    return this;
  }
};

script.FIND_ESCAPED_QUOTES = new RegExp( xregexp.escape( script.ESCAPED_QUOTE ) + '"|"' +  xregexp.escape(script.ESCAPED_QUOTE), "g"),
script.New.prototype.parse = function () {
  var raw_arr = this["code"]().split(/(\s+)/),
      arr     = [], 
      temp    = null,
      in_str  = false,
      str     = "",
      trim    = null;

  while( temp = raw_arr.shift() ) {
    trim = temp.trim();

    if ( _.first(trim) === '"' ) {
      str = temp;
      in_str = true;
      continue;
    };
    
    if ( in_str ) {
      str += temp
        
      if ( _.last(trim) === '"' ) {
        in_str = false;
        arr.push( 
            str.slice(1, str.length - 1 ) 
            .replace( script.FIND_ESCAPED_QUOTES, '"' )
            // .split(script.ESCAPED_START_QUOTE).join('"') 
            // .split(script.ESCAPED_END_QUOTE).join('"') 
            );
      } 
      
      continue;
    };
    
    
    if( trim != "" )
      arr.push(temp);
    
  };

  return arr;
}


