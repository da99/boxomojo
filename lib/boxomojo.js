
var _  = require('underscore')
Parser = require('boxomojo/lib/Parser.js').Parser
;


var B = exports.Boxomojo = function () {};

var NONE = B.NONE = {type : 'NONE', value: 'NONE', is_none : true};
var IS_NONE   = function (val) { return _.isObject(val) && val.type === 'NONE'; };
var IS_FUNC   = function (val) { return _.isObject(val) && val.is_box && val.is('{}'); };
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

B.run_ables = ['w[]w', '[]', '()'];

B.new = function (str, origin, env_box) {
  var b       = new B;
  b.is_box    = true;
  b.fin       = false;
  b.acts_like = [];
  b.Modules   = [];
  b.Env_Box   = env_box;
  b.Returns   = [];
  b.Executing_Tokens = [];
  b.Vars      = {};
  b.Origin    = origin;
  b.Original  = [str, origin];
  b.push_module(Base);

  if (_.isString(str)) {
    b.Code   = str;
    b.Parser = Parser.new(str);
    b.Tokens = b.Parser.tokens.slice();
  } else {
    if (_.contains(B.run_ables, str.kind))
      b.acts_like.push('run_able');

    b.Tokens = str.tokens.slice();
    b.acts_like.push(str.kind);

    if (origin)
      b.push_module(origin);
  }

  return b;
};

B.prototype.val = function () {
  if (!this.fin)
    this.throw('No run yet.');
  return _.last(this.Returns);
};

B.prototype.is = function (val) {
  return _.contains(this.acts_like, val);
};

B.prototype.throw = function (err) {
  if (_.isString(err))
    err = new Error(err);
  throw err;
};

B.prototype.run = function (box) {
  if (this.fin)
    this.throw( new Error('Already finished running.') );

  var me = this;
  if (me.is('{}') && box) {
    var spawn = B.new.apply(null, me.Original.concat(box));
    return spawn.run();
  }

  if (me.Env_Box) {
    me.Returns = me.Env_Box.Returns;
    me.Executing_Tokens = me.Env_Box.Executing_Tokens;
  } else {
    me.Executing_Tokens = me.Tokens.slice();
  };

  return me.run_next();
};

B.prototype.run_next = function () {
  var me = this;

  if (!me.Executing_Tokens.length) {
    me.fin = true;
    return me.val();
  }

  var v = me.front();
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
  return this.val();
};

B.prototype.back = function (val) {
  if (arguments.length) {
    this.Returns.push(val);
    return this;
  }

  if (this.back_empty())
    this.throw('Returns stack is empty.');
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

B.prototype.back_empty  = function () { return this.Returns.length == 0; }
B.prototype.front_empty = function () { return this.Executing_Tokens.length == 0; }

B.prototype.front = function (val) {
  if (arguments.length) {
    this.Executing_Tokens.unshift(val);
    return this;
  }

  var me = this;
  if (me.front_empty())
    me.throw('No more tokens to process.');
  var v = this.Executing_Tokens.shift();

  if (!v)
    return v;

  if (_.isObject(v) && v['func_call?']) {
    var func = me.find_or_throw(v.value);

    if (func && _.isFunction(func)) {
      func(me);
      return me.front();
    }

    if (_.isObject(func)) {
      me.front(func);
      v = me.run_next();
    } else
      v = func;

  } else if (_.isObject(v) && v['raw?']) {

    var kind = v.kind;
    v = B.new(v, me);
    if (v.is('run_able'))
      v.run();

    if (v.is('()'))
      v = v.val();

  }

  return v;
};

B.prototype.write_var = function (name, val) {
  var box = this;
  box.Vars[name] = val;
  return val;
};

B.prototype.return = function (val) {
  this.Returns.push(val);
  return this;
};

var Base = {
  vals: {
    '+' : function (box) {
      box.front( box.back() + box.front() );
      return true;
    },
    '='  : function (box) {
      var name = box.back();
      var val  = box.front();
      box.write_var(name, val);
      box.front(val);
      return true;
    },
    ',' : function (box) {
      return true;
    },
    '[<>]' : function (box) {
      box.front(box);
      return true;
    },
    '::' : function (box) {
      box.front(box.back().find(box.front()));
      return true;
    },
    ':' : function (box) {
      var val = box.back().find(box.front());
      box.front(val || NONE);
      return true;
    },
    'run' : function (box) {
      if (box.front_empty())
        box.throw('run: Front stack is empty.');
      var val = box.front();
      if (IS_NONE(val))
        box.throw('run: Can not run NONE.');
      if (!IS_FUNC(val))
        box.throw('run: Value is not a function: ' + TO_STRING(val));
      val.run();
      if (val.back_empty()) {
        box.front(NONE);
      } else {
        box.front(val.val());
      }
      return true;
    }
  },
  find : function (name) {
    return this.vals[name];
  }
};






