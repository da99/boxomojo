
var _  = require('underscore')
Parser = require('boxomojo/lib/Parser.js').Parser
;


var B = exports.Boxomojo = function () { };

B.new = function (str) {
  var b    = new B();
  b.Code   = str;
  b.is_box = true;
  b.Parser = Parser.new(str);
  b.Tokens = b.Parser.tokens.slice();
  b.fin    = false;
  return b;
};

B.prototype.throw = function (err) {
  throw err;
};

B.prototype.run = function () {
  if (this.fin)
    this.throw( new Error('Already finished running.') );

  var me = this;
  me.Stack   = [];
  me.Returns = [];
  me.Vars    = {};
  me.Executing_Tokens = me.Tokens.slice();

  while (me.Executing_Tokens.length) {
    var v = me.Executing_Tokens.shift();
    var func = null;
    if (_.isObject(v) && v['func_call?']) {
      func = Base[v.value]
      if (func)
        func(me);
      else
        me.throw(new Error('Not defined: ' + v.value));
    } else {
      me.Stack.push(v);
      me.return(v);
    }
  }

  me.fin = true;
  return _.last(me.Returns);
};

B.prototype.pop_left = function () {
  return this.Stack.pop();
};

B.prototype.pop_right = function () {
  return this.Executing_Tokens.shift();
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
  }
};






