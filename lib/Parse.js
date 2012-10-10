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
      last_block.values.push( Parse.new_string( 
        str.slice(1, str.length - 1 ).replace( e.constructor.FIND_ESCAPED_QUOTES, '"' )
      ) );
      
      continue;
      
    };
 
    
    // ==============================================================
    //                        Handle Blocks
    // ==============================================================

    trim = temp.trim();
    end_block = e.constructor.BLOCKS[trim];
    start_block = end_block && trim;
    
    if ( start_block ) {
      new_block = Parse.new_block( start_block, end_block  )
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
      last_block.values.push( number );
    else 
      last_block.values.push(trim);
    
  };

  return arr.values;
  
};

Parse.new_string = function ( val ) {
  return { value: val , is_string: true };
};

Parse.new_object = function () {

};

Parse.new_block = function ( start, end )  {
  
    
  if ( start === '#{' ) {
    return { 
      is_list: true, 
      values:  [] , 
      is_raw:  true, 
      start:   start, 
      end:     end 
    };
    
  } else if ( start === 'w{' ) {
    return { 
      is_w_list: true, 
      values:    [] , 
      is_raw:    true, 
      start:     start, 
      end:       end 
    };
    
  } else if ( start === '{' ) {
    return { 
      is_function: true, 
      values: [], 
      start:  start, 
      end:    end 
    };
    
  } else if ( start === 'o{' ) {
    return {
      values: [],
      vars:   {},
      'About:':  {
        'is object?': true,
        'forward missing vars to' : null, 
        'public' : { all: false, list: [] },
        'private': { all: true,  list: [] }
        'is raw?': true,
        'start':   start,
        'end':     end,
      }
    };
  };

  throw new Error('new_object: unknown block type: ' + start + ' ' + end);

};




// ==============================================================
//                        Parse
// ==============================================================


var Parse = function (code) {
  var strings = code.split( /\s+/g );
  var tokens  = [];
  var temp    = null;
  while( strings.length ) {
    temp = strings.shift();
    if(temp != '' )
      tokens.push(FS.type_cast(temp));
  };

  return tokens;
};

Parse.To_Core_Function = function (func) {
  var core = {
    'javascript?' : true,
    'function'    : func
  };

  Object.defineProperty( core, 'core?', { value: true,
    configurable : false,
    enumerable   : false,
    writable     : false });

  return core;
};

Parse.To_Function = function (back, forth, returns, func) {
  return({
    'backward'    : Parse.To_Function_Args(back),
    'forward'     : Parse.To_Function_Args(forth),
    'returns'     : Parse.To_Function_Args(returns),
    'javascript?' : true,
    'function'    : func
  });
};

Parse.To_Functions_List = function (arr) {
  return { 'functions list?' : true, 'functions' : arr };
};
Parse.To_Verb = function (ele) {
  return { 'verb?': true; 'value': ele };
};

Parse.To_Function_Args = function (arr) {
  if(arr.length % 2 !== 0)
    throw new Error('Uneven number of args: ' + arr');
  var new_arr = [];
  _.each(arr, function (e, i, l) {
    if(i % 2 === 0)
    new_arr.push(e);
    else
    new_arr.push(Parse.Verb(e));
  }) ;

  return new_arr;
};

module.exports = Parse;
