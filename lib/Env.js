var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp,
    script  = require("factor_script"),
    Parse   = require("factor_script/lib/Parse"),
    Base_Vars=require("factor_script/lib/Base_Vars"),
    ep      = null;

function Env(code, out) {
  var local = {};
  
  local['Outside']  = out;
  local['Read Env'] = out;
  local['Write Env']= null;
  local['Local Returns'] = [];
  local['Local Vars'] = {};
  local['Original Instructions'] = code;
  local['Instructions']          = code;
  local['is env?'] = true;

  this.sandbox = local;
  this._vars_ = [ local['Local Vars'], local, Base_Vars];
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
      // i      = -1,
      // len    = tokens.length,
      t      = null,
      
      default_kv = this.stack('Local Vars'),
      default_n  = this.stack('Local Returns'),
      
      v      = null,
      v_found = null,
      last_return = null;

  while( t = tokens.shift()  ) {

    if ( t.is_number || t.is_string ) {
      default_n.push(t);
      continue;
    };
    
    v = this.var_read( t );
    
    last_return = ( _.isFunction(v) ) ?
      v( { word: t, env: this } )  :
      v;
    
    default_n.push(last_return);
    
  }; // end while

  return this;
};

ep.parse = function () {
  this._tokens_ = Parse(this);
  return this._tokens_;
}


// ==============================================================
//                        Stacks
// ==============================================================

ep.stack = function (name) {
  if (name == 'tokens')
    return this._tokens_;
  return this.var_read(name || "Local Returns");
};

// ==============================================================
//                        Vars
// ==============================================================

ep.var_create = function (name, val) {
  var old = this.var_desc(name);
  if (old.is_found)
      throw new Error('var_create: var already created: ' + name);
  
  if (!name.is_string) 
    throw new Error('var_create: name is not a stirng: ' + name );
  this.stack('Local Vars')[name.value] = val;

  return val;
};


ep.var_desc = function(name) {
  
  var vs = this._vars_,
      is_found = false,
      i = -1, 
      len = this._vars_.length,
      stack = null,
      missing_func = null,
      missing_func_name = 'When var is missing:',
      v;
  
  while ( ++i < len ) {
    
    stack = vs[i];
    
    if (stack.hasOwnProperty(name)) {
      is_found = true;
      v = stack[name]
    };
    
    if (is_found) 
      break;
  };
  
  if (is_found)
    return { is_found: true, value: v };

  if (name == missing_func_name)
    return { is_found: is_found, missing_func: undefined };
  else
    return { is_found: is_found, missing_func: this.var_desc(missing_func_name)['value'] };
  
};

ep.var_read = function(name) {
  var result = this.var_desc(name);
  if (result.is_found)
    return result.value;
  if (result.missing_func)
    return result.missing_func(name);

  throw new Error("var_read: var is not defined: " + name);
};

ep.var_update = function (name, val) {
  var w = this.var_read('Write Env'),
      map = this.var_read('Local Vars');
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







