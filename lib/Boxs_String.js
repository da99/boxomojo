
module.exports = {};
var o = module.exports;

o.fs = {
  '~~~?' : function (box) { return box.respond(true); },
  '+' : function (box) {
    if (box['Tokens'].length == 0)
      return false;
    var next_str = box.grab_forward();
    box.respond(box.JS_Object + next_str);
    return true;
  },

  '*' : function (box) {
    if (box['Tokens'].length == 0)
      return false;

    var next_int = box.see_forward();
    var target = box.JS_Object;

    if (!next_int || !next_int.is_number() || next_int < 1)
      return false;
    else
      next_int = box.grab_forward();
    var new_str = "";
    while (next_int > 0) {
      new_str += target;
      --next_int;
    };
    box.respond(new_str);
    return true;
  }
};

o.js = {
};
