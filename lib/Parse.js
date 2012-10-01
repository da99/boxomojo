
function Parse( e ) {

  var raw_arr = e['code'].split(/(\s+)/),
      arr     = { 'values' : [], 'start': '{', 'end': '}'}, 
      temp    = null,
      in_str  = false,
      
      str     = "",
      trim    = null,
      new_str = null,
      
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
        new_str = {
          value: str.slice(1, str.length - 1 ) 
            .replace( e.FIND_ESCAPED_QUOTES, '"' ),
          "is string?": true
        };
        last_block.values.push( new_str );
      } 
      
      continue;
    };
    
    // ==============================================================
    //                        Handle Blocks
    // ==============================================================


    end_block = e.BLOCKS[trim];
    start_block = end_block && trim;
    
    if ( start_block ) {
      new_block = { "values": [], "start": start_block, "end": end_block }
      last_block = new_block;
      blocks.push(new_block);
      in_block = true;
      continue;
    }

    end_block = e.BLOCK_ENDS[trim] && trim;
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
  
};

module.exports = Parse;
