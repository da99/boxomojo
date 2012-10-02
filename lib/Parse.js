var _       = require("underscore");

function New_Str() {
};

function Parse( e ) {

  var raw_arr = e.var_read('Instructions').split(/(\s+)/),
      arr     = { 'values' : [], 'start': '{', 'end': '}'}, 
      temp    = null,
      
      str     = null,
      trim    = null,
      start_str = false,
      end_str   = false,
      
      blocks  = [],
      in_block = false,
      start_block = null,
      end_block = null,
      last_block = null,
      new_block = null,
      
      number = null;

  last_block = arr;
  while (raw_arr.length != 0) {
    temp = raw_arr.shift()

    // ==============================================================
    //                        Handle Quotation Marks
    // ==============================================================

    start_str = _.first(temp) === '"';
    
    if ( start_str ) {
      
      str = temp;
      end_str   =  _.last(temp) === '"';
    
      // If string is open, grab next tokens until 
      //   string is closed.
      if( !end_str ) 
        while ( raw_arr.length != 0 ) {
          temp      = raw_arr.shift();
          start_str = _.first(temp) === '"';
          end_str   =  _.last(temp) === '"';
          
          if ( start_str )
            throw new Error("String already started: " + temp);
          
          str += temp;
          
          if ( end_str ) 
            break;
          
        }

      if ( _.last(str) != '"' )
        throw new Error("String not closed: " + str );
      
      // Finally... insert the string.
      last_block.values.push( {
        value: str.slice(1, str.length - 1 ) 
          .replace( e.constructor.FIND_ESCAPED_QUOTES, '"' ),
        is_string: true
      });
      
      continue;
      
    };
 
    
    // ==============================================================
    //                        Handle Blocks
    // ==============================================================

    trim = temp.trim();
    end_block = e.constructor.BLOCKS[trim];
    start_block = end_block && trim;
    
    if ( start_block ) {
      new_block = { "values": [], "start": start_block, "end": end_block }
      last_block = new_block;
      blocks.push(new_block);
      in_block = true;
      continue;
    }

    end_block = e.constructor.BLOCK_ENDS[trim] && trim;
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

    
    // Ignore all other whitespace
    if( trim === "" )
      continue;
      
    number = Number( trim );
    if ( _.isNumber( number ) && !_.isNaN(number) )
      last_block.values.push({ value: number, is_number: true });
    else 
      last_block.values.push(trim);
      
    
  };

  return arr.values;
  
};

module.exports = Parse;
