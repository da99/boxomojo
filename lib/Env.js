var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp,
    script  = require("factor_script"),
    Parse   = require("factor_script/lib/Parse"),
    ep      = null;

function Env(code, out) {
  this['Outside']  = out;
  this['Read Env'] = out;
  this['Write Env']= null;
  this['#{}s'] = { default: [] };
  this['w{}s'] = { default: {} };
  this['original code'] = code;
  this['code']          = code;
  this['is env?'] = true;
  return this;
};

ep = Env.prototype;

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
  var tokens = this.parse(),
      i      = -1,
      len    = tokens.length,
      t      = null,
      default_kv = this['w{}s']['default'],
      default_n  = this['#{}s']['default'],
      v      = null;

  while( ++i < len ) {
    t = tokens[i];

    if ( t.is_number || t.is_string ) {
      default_n.push(t);
      continue;
    };
    

    if ( default_kv.hasOwnProperty(t) ) {
      
      v = default_kv[t];
      if ( _.isFunction(v) )
        v( { token: t } );
      else
        default_n.push(v);
      
    } else {
      
      if ( default_kv['word not found'] ) 
        default_kv['word not found']( { token: t } );
      else 
        throw new Error("run: Word not defined: " + t );
      
      
    };
    
  }; // end while

  return this;
};

ep.parse = function () {
  return Parse(this);
}


// ==============================================================
//                        Stacks
// ==============================================================

ep.stack = function () {
  return this['#{}s']['default'];
};

// ==============================================================
//                        Vars
// ==============================================================

ep.var_create = function (name, val) {
  var w = this['Write Env'],
      map = this['w{}s']['default'];
  if (w) {
    w.var_create(name, val);
  } else {
    if ( map.hasOwnProperty(name) )
      throw new Error('var_create: var already created: ' + name);
    else
      map[name] = val;
  };

  return val;
};


ep.var_read = function(name) {
  return this.data[name];
};

ep.var_update = function (name, val) {
  var w = this['Write Env'],
      map = this['w{}s']['default'];
  if (w) {
    w.var_update(name, val);
  } else {
    if ( map.hasOwnProperty(name) )
      map[name] = val;
    else
      throw new Error('var_update: var does not exist: ' + name);
  };

  return val;
};



// ==============================================================
//                        The End
// ==============================================================



module.exports = Env;







