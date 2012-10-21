var h = require('factor_script/lib/helpers');

module.exports = {}

module.exports.Strings = ({
  'string?' : function (machine) { return machine.respond(true); }
});

module.exports.Functions = ({
  'function?' : function (m) { return m.respond(true); }
});

module.exports.Indexs = {
  'index?' : function (machine) { return machine.respond(true); },
  'get'    : function (machine) { return machine.target.Vars[machine.grab_forward()]; }
};

module.exports.Objects = {
  'object?' : function (machine) { return machine.respond(true); }
};


module.exports.Lists = ({
  'list?' : function (machine) { return machine.respond(true); },
  ']['    : function (box) {
    box.ensure_Tokens_not_empty();
    var target = box.grab_forward();
    if(!target.Tokens)
      box.throw_function_call_error("wrong kind of object: " + h.to_string([target]));
    target.Tokens = box.Object.Returns.concat(target.Tokens);
    box.respond(target);
    return true;
  },
  '+' : function (box) {
    box.ensure_Tokens_not_empty();

    var forw = box.grab_forward();
    if (forw['kind'] !== 'list')
      return false;

    var back = box.JS_Object;
    var vals = back.Returns.concat(forw.Returns);
    box.respond(new forw.klass(vals, box));
    return true;
  }
});

module.exports.Function_Calls = ({
  'function call?' : function (box) { return box.respond(true); },
});

module.exports.Numbers = ({

  'number?' : function (box) {
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


});

