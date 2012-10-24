
module.exports = {};
var o = module.exports;

o.fs = {
  '[]?' : function (machine) { return machine.respond(true); },
  ']['    : function (box) {
    box.ensure_Tokens_not_empty();
    var target = box.grab_forward();
    if(!target.Tokens)
      box.throw_function_call_error("wrong kind of box: " + h.to_string([target]));
    target.Tokens = box.Object.Returns.concat(target.Tokens);
    box.respond(target);
    return true;
  },

  '+' : function (box) {
    box.ensure_Tokens_not_empty();

    var forw = box.grab_forward();
    if (forw['kind'] !== '[]')
      return false;

    var back = box.JS_Object;
    var vals = back.Returns.concat(forw.Returns);
    var new_box = new forw.klass(vals, box);
    new_box.Returns = vals;
    box.respond(new_box);
    return true;
  }
};

o.js = {
};

