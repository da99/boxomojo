
var _  = require('underscore')
Parser = require('boxomojo/lib/Parser.js').Parser
;


var B = exports.Boxomojo = function () {};

var NONE = B.NONE = {type : 'NONE', value: 'NONE', is_none : true};
var IS_NONE = function (val) { return _.isObject(val) && val.type === 'NONE'; };
var IS_FUNC = function (val) { return _.isObject(val) && val.is_box && val.is('{}'); };
var TO_STRING = function (val) {
  if (_.isObject(val) && val.is_box) {
    return val.acts_like[0] + ': ' + (val.Code || val.Tokens);
  }

  if (_.isObject(val) && val.is_none) {
    return 'NONE';
  }

  if (_.isObject(val))
    return JSON.stringify(val);

  return val + '';
};

B.run_ables = ['w[]w', '{}', '[]', '()'];

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

B.prototype.is = function (val) {
  return _.contains(this.acts_like, val);
};

B.prototype.throw = function (err) {
  if (_.isString(err))
    err = new Error(err);
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

B.prototype.find_or_throw = function (name) {
  var val = this.find(name);
  if (!val)
    this.throw(new Error('Not defined: ' + name));
  return val;
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

B.prototype.front_empty = function () {
  return this.Executing_Tokens.length == 0;
}

B.prototype.pop_front = function () {
  var me = this;
  var v = this.Executing_Tokens.shift();

  if (!v)
    return v;

  if (_.isObject(v) && v['func_call?']) {
    var func = me.find_or_throw(v.value);

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
    if (_.contains(B.run_ables, v.kind)) {
      var kind = v.kind;
      v = B.new(v, me);
      v.run();
      if (kind === '()') {
        v = _.last(v.Returns);
      }

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
    '::' : function (box) {
      console.log(box.Returns)
      box.return(box.pop_back().find(box.pop_front()));
      console.log(box.Returns)
      return true;
    },
    ':' : function (box) {
      var val = box.pop_back().find(box.pop_front());
      box.push_front(val || NONE);
      return true;
    },
    'run' : function (box) {
      if (box.front_empty())
        box.throw('run: Front stack is empty.');
      var val = box.pop_front();
      if (IS_NONE(val))
        box.throw('run: Can not run NONE.');
      if (!IS_FUNC(val))
        box.throw('run: Value is not a function: ' + TO_STRING(val));
    }
  },
  find : function (name) {
    return this.vals[name];
  }
};






