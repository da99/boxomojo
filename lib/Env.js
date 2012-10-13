
var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp,
    script  = require("factor_script"),
    Parse   = require("factor_script/lib/Parse"),
    Base_Vars=require("factor_script/lib/Base_Vars"),
    ep      = null;

function Env(code, out, read_out, write_out) {
  var local = {};

  local['Outside']  = out;
  local['Read Env'] = out;
  local['Write Env']= null;
  local['Local Returns'] = [];
  local['Local Vars'] = {};
  local['Original Instructions'] = code;
  local['Instructions']          = code;
  local['is env?'] = true;

  if ( !_.isString(code) )
    this._tokens_ = code;

  this.read_out  = read_out;
  this.write_out = write_out;

  if (this.read_out ) {
    this._vars_ = [ local['Local Vars'], local, out];
  } else {
    this._vars_ = [ local['Local Vars'], local, Base_Vars];
  };

  this.sandbox = local;
  return this;
};

ep = Env.prototype;

Env.ESCAPED_QUOTE = '^';
Env.BLOCKS        = {
  '(' : ')',
  '{' : '}',
  '#{' : '}',
  'w{': '}',
  'o{': '}'
  };
Env.BLOCK_ENDS =  _.invert(Env.BLOCKS);
Env.FIND_ESCAPED_QUOTES = new RegExp( xregexp.escape( Env.ESCAPED_QUOTE ) + '"|"' +  xregexp.escape(Env.ESCAPED_QUOTE), "g"),


Env.prototype.run = function () {
  var tokens = null,
      t = null,

      default_kv = this.stack('Local Vars'),
      default_n  = this.stack('Local Returns'),

      v      = null,
      v_found = null,
      last_return = null;

  if ( !this._tokens_ )
    tokens = this.parse();

  while( t = this.grab_forward()  ) {
    default_n.push(t)
  }; // end while

  return this;
};

ep.parse = function () {
  if ( this._tokens_ )
    throw new Error("parse: already parsed");
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

ep.grab_forward = function () {
  var v = this.stack('tokens').shift(),
      last_return = null;

  if ( !v )
    return v;

  if ( v.end === '}' && v.start !== '{' )  {

    var sub_env = null;

    if ( v.start === 'w{' ) {
      sub_env = new Env(v.values, this, true);
      sub_env.run();
      return sub_env.stack('Local Vars');

    } else if ( v.start === '#{' ) {
      sub_env = new Env(v.values, this, true);
      sub_env.run();
      return sub_env.stack('Local Returns');

    } else {
      throw new Error("type_cast: unknown block start: " + v.start) ;
    };

  };

  if ( v.is_number || v.is_string )
    return v;

  // === Run token as code.
  last_return = this.var_read( v );

  return ( _.isFunction(last_return) ) ?
    last_return( {
      word: v,
      env: this,
      'Env Read Outside':  this.read_out,
      'Env Write Outside': this.write_out
    } )  :
      last_return;


};

ep.grab_backward = function () {
  var s = this.stack();
  if ( s.length === 0 )
    throw new Error("grab_backward: stack is empty")
  return s.pop();
};


// ==============================================================
//                        Vars
// ==============================================================

ep.var_create = function (name, val) {
  if (this.write_out)
    return this.var_read('Outside').var_create(name, val);

  var old = this.var_desc(name);

  if (old.is_found)
      throw new Error('var_create: var already created: ' + name);

  if (!name.is_string)
    throw new Error('var_create: name is not a stirng: ' + name );

  else
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
      desc = null,
      v;

  while ( ++i < len ) {

    stack = vs[i];

    if (stack.var_desc) {
      return stack.var_desc(name);
    } else {
      if (stack.hasOwnProperty(name)) {
        is_found = true;
        v = stack[name]
      };
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







