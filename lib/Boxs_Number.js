
module.exports = {};
var o  = module.exports;

o.fs = {
  '#?' : function (box) {
    return box.respond(true);
  },

  '+' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back + forw);
    return true;
  },

  '-' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back - forw);
    return true;
  },

  '*' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back * forw);
    return true;
  },

  '/' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back / forw);
    return true;
  },

  '/.' : function (box) {
    box.ensure_Tokens_not_empty();

    var back = box.JS_Object;
    var forw = box.grab_forward();

    if (!forw.is_number()) {
      return false;
    };

    box.respond(back % forw);
    return true;
  }
};

o.js = {};

