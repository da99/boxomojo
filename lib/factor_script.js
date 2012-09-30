var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp;


module.exports = script = { 
  ESCAPED_QUOTE: '^' ,
  BLOCKS: { "(" : ")", "{" : "}" },
  New: function (code) {
    var original_code = code;
    this["original code"] = function () { return original_code; };
    this["code"]          = function () { return code; };
    this["is a factor script?"] = function () { return true; }
    return this;
  }
};

script.BLOCK_ENDS =  _.invert(script.BLOCKS);
script.FIND_ESCAPED_QUOTES = new RegExp( xregexp.escape( script.ESCAPED_QUOTE ) + '"|"' +  xregexp.escape(script.ESCAPED_QUOTE), "g"),
script.New.prototype.parse = function () {
  var raw_arr = this["code"]().split(/(\s+)/),
      arr     = { "values" : [], "char": "{" }, 
      temp    = null,
      in_str  = false,
      in_block = false,
      blocks  = [],
      start_block = null,
      end_block = null,
      last_block = null,
      new_block = null,
      str     = "",
      trim    = null;

  last_block = arr;
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
        last_block.values.push( 
            str.slice(1, str.length - 1 ) 
            .replace( script.FIND_ESCAPED_QUOTES, '"' )
            );
      } 
      
      continue;
    };
    
    start_block = script.BLOCKS[trim];
    if ( start_block ) {
      new_block = { "values": [], "char": trim }
      last_block = new_block
      blocks.push(new_block);
      in_block = true;
      continue;
    }

    end_block = script.BLOCK_ENDS[trim];
    if (end_block) {
      if ( !in_block ) 
        throw new Error("Ending unopened block: " + end_block);
      new_block = last_block;
      blocks.pop();
      in_block = ! _.isEmpty(blocks);
      last_block = (in_block) ? _.last(blocks) : arr;
      last_block.values.push(new_block);
      continue;
    };
    
    if( trim != "" )
      last_block.values.push(temp);
    
  };

  return arr.values;
}


