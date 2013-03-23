
var _  = require('underscore')
Parser = require('boxomojo/lib/Parser.js').Parser
;


var B = exports.Boxomojo = function () { };

B.object_types = ['w[]w', '{}', '[]'];

B.new = function (str) {
  var b       = new B();
  b.is_box    = true;
  b.fin       = false;
  b.acts_like = [];

  if (_.isString(str)) {
    b.Code   = str;
    b.Parser = Parser.new(str);
    b.Tokens = b.Parser.tokens.slice();
  } else {
    b.Tokens    = str.tokens.slice();
    b.acts_like = [str.kind];
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
  me.Returns = [];
  me.Vars    = {};
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

  var v = me.pop_right();
  me.return(v);

  return me.run_next();
};

B.prototype.return = function (val) {
  return this.Returns.push(val);
};

B.prototype.pop_left = function () {
  return this.Returns.pop();
};

B.prototype.pop_right = function () {
  var me = this;
  var v = this.Executing_Tokens.shift();

  if (_.isObject(v) && v['func_call?']) {
    var func = Base[v.value]
    if (func)
      return func(me);
    else
      me.throw(new Error('Not defined: ' + v.value));
  } else {
    if (_.contains(B.object_types, v.kind)) {
      v = B.new(v);
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
  '+' : function (box) {
    box.return(box.pop_left() + box.pop_right());
    return true;
  },
  '='  : function (box) {
    box.write_var(box.pop_left(), box.pop_right());
    return true;
  },
  ',' : function (box) {
    return true;
  }
};






