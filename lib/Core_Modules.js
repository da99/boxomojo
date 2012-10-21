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
  'object?' : function (machine) { return machine.respond(true); },
  '<+' : function (box) {
    box.ensure_Tokens_not_empty();
    var name  = box.grab_forward();
    box.ensure_Tokens_not_empty();
    var value = box.grab_forward();
    if (box.Object.is_var(name))
      box.throw_function_call_error('Var already created: ' + name);
    box.Object['Vars'][name] = value;
    box.respond(value);
    return true;
  },

  '<+?+' : function (box) {
    box.ensure_Returns_not_empty();
    if( box.is_var(box.grab_forward()) )
      box.Tokens.unshift(Parse.To_Function_Call('<++'));
    else
      box.Tokens.unshift(Parse.To_Function_Call('<+'));

    return true;
  },

  '<++:' : function (box) {
    box.ensure_both_stacks_not_empty();
    var name = box.grab_backward();
    var val  = box.grab_forward();
    if (box.Core_Vars.hasOwnProperty(name)) {

      if (name == '^[]^' || name == '[<>]!')
        box.throw_function_call_error('core var may not be updated: ' + name)

      box.Core_Var[name] = val;
      return val;

    };

    if (!box.Vars.hasOwnProperty(name))
      box.throw_function_call_error('var does not exist yet: ' + name);

    box.Vars[name] = val;
    box.respond(val);
    return true;
  },

  '<+-' : function (box) {
    box.ensure_Returns_not_empty();
    var name = box.grab_backward();
    var val = box.read_var(name);
    delete box.Vars[name];
    box.respond(val);
    return true;
  }

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

