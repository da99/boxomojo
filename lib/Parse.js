var _       = require("underscore"),
    objects = require('factor_script/lib/Objects');

// ==============================================================
//                        Parse
// ==============================================================

var Blocks = {
  '('  :  [')'  , 'To_Run_Now_Function'],
  '['  :  [']'  , 'To_List'],
  'k[' :  [']k' , 'To_KV_List'],
  "{"  :  ["}"  , 'To_Anon_Function']
};

function Parse( m ) {

  var raw_arr     = m.Code.split(/(\s+)/),
      arr         = { 'values' : [], 'start': '{', 'end': '}'},
      temp        = null,

      str         = null,
      trim        = null,
      start_str   = false,
      end_str     = false,

      blocks      = [],
      in_block    = false,
      start_block = null,
      end_block   = null,
      last_block  = null,
      new_block   = null,

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

// ==============================================================
//                   To Functionality
// ==============================================================

Parse.To_Verb = function (name) {
  return({ 'verb?' : true, 'value' : name });
};

Parse.To_Function = function (js) {
  var f          = (js || []);
  var o          = f.factor_script('object');
  o.nouns.push(Function_Functions);
  o['function?'] = true;
  return f;
  // Parse.To_Function = function (back, forth, returns, func) {
  // };
  // return({
    // 'backward'    : Parse.To_Function_Args(back),
    // 'forward'     : Parse.To_Function_Args(forth),
    // 'returns'     : Parse.To_Function_Args(returns),
    // 'javascript?' : true,
    // 'function'    : func
  // });
};

Parse.To_Function_List = function (arr) {
  return arr;
};

Parse.To_Run_Now_Function = function (js) {
  var f         = Parse.To_Function(js);
  var o         = f.factor_script('object');
  o.run_now     = true;
  o['run now?'] = true;
  return f;
};

Parse.To_KV_List = function (js) {
  var kv        = (arguments[1] || {});
  var code      = arguments[2];
  var o         = kv.factor_script('object');
  o['kv list?'] = true;
  o.code        = code;
  if(!code)
    throw new Error('code is required');
  return kv;
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
