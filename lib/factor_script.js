var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp;


module.exports = script = { 
  ESCAPED_QUOTE: '^' ,
  BLOCKS: { '(' : ')', '{' : '}', '#{' : '}', 'w{': '}' },
  New: function (code) {
    this['original code'] = code;
    this['code']          = code;
    this['is a factor script?'] = true;
    return this;
  }
};

script.BLOCK_ENDS =  _.invert(script.BLOCKS);
script.FIND_ESCAPED_QUOTES = new RegExp( xregexp.escape( script.ESCAPED_QUOTE ) + '"|"' +  xregexp.escape(script.ESCAPED_QUOTE), "g"),
script.New.prototype.parse = function () {
  var raw_arr = this['code'].split(/(\s+)/),
      arr     = { 'values' : [], 'start': '{', 'end': '}'}, 
      temp    = null,
      in_str  = false,
      
      str     = "",
      trim    = null,
      
      blocks  = [],
      in_block = false,
      start_block = null,
      end_block = null,
      last_block = null,
      new_block = null;

  last_block = arr;
  while (raw_arr.length != 0) {
    temp = raw_arr.shift()
    trim = temp.trim();

    // ==============================================================
    //                        Handle Quotation Marks
    // ==============================================================

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
    
    // ==============================================================
    //                        Handle Blocks
    // ==============================================================


    end_block = script.BLOCKS[trim];
    start_block = end_block && trim;
    
    if ( start_block ) {
      new_block = { "values": [], "start": start_block, "end": end_block }
      last_block = new_block;
      blocks.push(new_block);
      in_block = true;
      continue;
    }

    end_block = script.BLOCK_ENDS[trim] && trim;
    if ( end_block ) {
      if ( !in_block ) 
        throw new Error("Ending unopened block: " + end_block);
      if ( last_block["end"] != end_block ) 
        throw new Error("Closing the wrong block. actual: " + end_block + " expected: " + last_block["end"] );
      new_block = last_block;
      
      blocks.pop();
      in_block = ! _.isEmpty(blocks);
      last_block = (in_block) ? _.last(blocks) : arr;
      last_block.values.push(new_block);
      continue;
    };

    // ==============================================================
    //                        Handle Everything Else
    // ==============================================================

    if( trim != "" )
      last_block.values.push(temp);
    
  };

  return arr.values;
}


