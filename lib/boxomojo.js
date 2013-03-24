
var _  = require('underscore')
Parser = require('boxomojo/lib/Parser.js').Parser
;


var B = exports.Boxomojo = function () {};

B.object_types = ['w[]w', '{}', '[]'];

B.new = function (str, origin) {
  var b       = new B;
  b.is_box    = true;
  b.fin       = false;
  b.acts_like = [];
  b.Modules   = [];
  b.Returns   = [];
  b.Vars      = {};
  b.push_module(Base);

  if (_.isString(str)) {
    b.Code   = str;
    b.Parser = Parser.new(str);
    b.Tokens = b.Parser.tokens.slice();
  } else {
    b.Tokens    = str.tokens.slice();
    b.acts_like = [str.kind];
    if (origin)
      b.push_module(origin);
  }

  return b;
};

B.prototype.throw = function (err) {
  throw err;
};

B.prototype.run = function (flow) {
  if (this.fin)
    this.throw( new Error('Already finished running.') );

  var me = this;
  me.Executing_Tokens = me.Tokens.slice();

  if (flow)
    throw new Error('not ready for flow.');

  return me.run_next();
};

B.prototype.run_next = function () {
  var me = this;

  if (!me.Executing_Tokens.length) {
    me.fin = true;
    return _.last(me.Returns);
  }

  var v = me.pop_front();
  me.return(v);

  return me.run_next();
};

B.prototype.return = function (val) {
  return this.Returns.push(val);
};

B.prototype.push_module = function (mod) {
  return this.Modules.push(mod);
};

B.prototype.read_back = function () {
  return _.last(this.Returns);
};

B.prototype.pop_back = function () {
  return this.Returns.pop();
};

B.prototype.find = function (name) {
  var me = this;
  var v  = me.Vars[name];
  if (v)
    return me.Vars[name];
  _.find(me.Modules, function (mod, i) {
    v = mod.find(name);
    return v;
  });
  return v;
};

B.prototype.push_front = function (val) {
  this.Executing_Tokens.unshift(val);
  return this;
};

B.prototype.pop_front = function () {
  var me = this;
  var v = this.Executing_Tokens.shift();

  if (!v)
    return v;

  if (_.isObject(v) && v['func_call?']) {
    var func = me.find(v.value);
    if (!func)
      me.throw(new Error('Not defined: ' + v.value));

    if (func && _.isFunction(func)) {
      func(me);
      return me.pop_back();
    }

    if (_.isObject(func)) {
      me.push_front(func);
      v = me.run_next();
    } else
      v = func;

  } else {
    if (_.contains(B.object_types, v.kind)) {
      v = B.new(v, me);
      v.run();
    }
  }

  return v;
};

B.prototype.write_var = function (name, val) {
  var box = this;
  box.Vars[name] = val;
  box.Returns.push(val);
  return box;
};

B.prototype.return = function (val) {
  this.Returns.push(val);
  return this;
};

var Base = {
  vals: {
    '+' : function (box) {
      box.return(box.pop_back() + box.pop_front());
      return true;
    },
    '='  : function (box) {
      box.write_var(box.pop_back(), box.pop_front());
      return true;
    },
    ',' : function (box) {
      return true;
    },
    '[<>]' : function (box) {
      box.return(box);
      return true;
    },
    ':' : function (box) {
      box.return(box.pop_back().find(box.pop_front()));
    }
  },
  find : function (name) {
    return this.vals[name];
  }
};






