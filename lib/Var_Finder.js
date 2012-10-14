
// ==============================================================
//                    Common Functionality
// ==============================================================

var next_verb = function () {
  var temp = this.next();
  if(temp && temp['function?']) {
    return temp;
  };

  return this.next();
};


// ==============================================================
//                       Functions
// ==============================================================

var Functions = function (obj, func_name) {
  this.value   = obj['Functions'][func_name];
  this.is_done = false;
  this.aliases = new Function_Aliases(obj, func_name);
};

Functions.prototype.next = function () {
  if (this.aliases.next())
    return true;

  if (this.is_done)
    return false;

  this.is_done = true;
  return true;
};


// ==============================================================
//                       Function Aliases
// ==============================================================

var Function_Aliases = function (obj, func_name) {
  this.value  = null;
  this.list   = obj['Function Aliases'][func_name];
  this.i      = this.list.length;
};

Functions.prototype.next = function () {
  --this.i;
  if (this.i < 0)
    return false;
  this.value = this.list[this.i];
  return true;
};


// ==============================================================
//                      Modules
// ==============================================================

var Modules = function (list, verb) {
  this.list   = list.slice();
  this.verb   = verb;
  this.value  = null;
  this.finder = null;
};

Modules.prototype.next = function () {
  if (this.list.length == 0)
    return false;

  if (this.finder) {
    var temp = this.finder.next();
    if(temp)
      return temp;
    this.finder = null;
  };

  this.finder = new KV_List(this.list.pop(), this.verb);
  return this.finder.next();
};

// ==============================================================
//                  KV Lists (as modules)
// ==============================================================


var KV_List = function (noun, verb) {
  this.noun        = noun;
  this.verb        = verb;
  this.list        = null;
  this.i           = null;
  this.finder      = null;
  this.done        = false;
  this.last_answer = null;
};


KV_List.prototype.is_done = function () {
  return this.done;
};

KV_List.prototype.next_verb = next_verb;

KV_List.prototype.next = function () {
  if (this.done)
    return null;

  if (this.list) {

    if(this.i > 0) {
      return this.list[--this.i];
    }

    if (this.is_local()) {
      this.done = true;
      return null;
    };

  };

  var temp_ans = this.noun.hasOwnProperty(verb) && this.noun[verb];
  if(temp_ans) {

    if(temp_ans['functions list?']) {

      this.list = temp_ans;
      this.i    = temp_ans.length;
      return this.next();

    } else if (temp_ans && temp_ans != this.last_answer) {

      this.last_answer = temp_ans;
      return temp_ans;

    } else if ((temp_ans == this.last_answer) || !temp) {
        if (this.is_local())
          throw new Error('not done');
    } else {
      throw new Error('not done');
    };


  };

};

// ==============================================================
//                        Vars
// ==============================================================

var Vars = function (list, verb) {
  this.value  = list[verb];
  this.finder = null;
  this.done   = false;
};

Vars.prototype.next = function () {
  if (this.done)
    return false;

  if (this.finder)
    return this.finder.next();

  if (this.value && this.value['functions list?']) {
    this.finder = new Functions(this.value);
    return this.finder.next();
  };

  this.done = true;
  return true;
};

// ==============================================================
//                        Box
// ==============================================================


var Box = function (machine, verb) {
  this.machine        = machine;
  this.verb           = verb || machine.verb;
  this.vars_finder    = null;
  this.outside_finder = null;
  this.done           = false;
};

Box.prototype.next_verb = next_verb;

Box.prototype.next = function () {
  if (this.done)
    return null;

  if (this.vars_finder) {
    var temp = this.vars_finder.next();
    if (temp)
      return temp;
  } else {
    this.vars_finder = new Vars(this.machine.Vars, this.verb);
    return this.vars_finder.next();
  };

  if (this.outside_finder) {
    var temp = this.outside_finder.next();
    if (temp)
      return temp;
  } else {
    if (!this.machine.is_local() && this.machine.Outside) {
      this.outside_finder = new Box(this.machine.Outside, this.verb);
      return this.outside_finder.next();
    };
  };

  this.done = true;
  return false;

};


module.exports = {
  Functions     : Functions,
  Modules       : Modules,
  Module        : Module,
  Vars          : Vars,
  Box           : Box
};


