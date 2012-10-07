

// ==============================================================
//                        For Functions List
// ==============================================================

Var_Finder.Functions_List = function (list) {
  this.list    = list.slice();
  this.value   = null;
};

Var_Finder.Functions_List.prototype.next = function () {
  if (this.list.length == 0) {
    return false;
  this.value = this.list.pop();
  return true;
};


// ==============================================================
//                        For Nouns List
// ==============================================================

Var_Finder.Nouns_List = function (list, verb) {
  this.list  = list.slice();
  this.verb  = verb;
  this.value = null;
  this.finder = null;
};

Var_Finder.Nouns_List.prototype.next = function () {
  if (this.list.length == 0)
    return false;

  if (this.finder) {
    var temp = this.finder.next();
    if(temp)
      return temp;
    this.finder = null;
  };

  this.finder = new Var_Finder.Noun(this.list.pop(), this.verb);
  return this.finder.next();
};


// ==============================================================
//                        For Vars List
// ==============================================================

Var_Finder.Vars = function (list, verb) {
  this.value  = list[verb];
  this.finder = null;
  this.done   = false;
};

Var_Finder.Vars.prototype.next = function () {
  if (this.done)
    return false;

  if (this.finder)
    return this.finder.next();

  if (this.value && this.value['functions list?']) {
    this.finder = new Var_Finder.Functions_List(this.value);
    return this.finder.next();
  };

  this.done = true;
  return true;
};

// ==============================================================
//                        For Machine
// ==============================================================


Var_Finder.Machine = function (machine, verb) {
  this.machine        = machine;
  this.verb           = verb;
  this.vars_finder    = null;
  this.outside_finder = null;
  this.done           = false;
};

Var_Finder.For_Machine.prototype.next = function () {
  if (this.done)
    return null;

  if (this.vars_finder) {
    var temp = this.vars_finder.next();
    if (temp)
      return temp;
  } else {
    this.vars_finder = new Var_Finder.Vars(this.machine.Vars, this.verb);
    return this.vars_finder.next();
  };

  if (this.outside_finder) {
    var temp = this.outside_finder.next();
    if (temp)
      return temp;
  } else {
    if (!this.machine.is_local() && this.machine.Outside) {
      this.outside_finder = new Var_Finder.For_Machine(this.machine.Outside, this.verb);
      return this.outside_finder.next();
    };
  };

  this.done = true;
  return false;

};

// ==============================================================
//                        For Noun
// ==============================================================


Var_Finder.For_Noun = function (noun, verb) {
  this.noun        = noun;
  this.verb        = verb;
  this.list        = null;
  this.i           = null;
  this.finder      = null;
  this.done        = false;
  this.last_answer = null;
};


Var_Finder.For_Noun.prototype.is_done = function () {
  return this.done;
};
Var_Finder.For_Noun.prototype.next = function () {
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
    } else {};


  };

};


module.exports = Var_Finder;
