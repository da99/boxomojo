
var Var_Finder = require('factor_script/lib/Var_Finder');

// ==============================================================
//                        Nouns
// ==============================================================

var Noun = function () {
  this.Returns        = [];
  this.Vars           = {};
  this.Noun_Lists     = [];
};

Noun.prototype.value = function () {
  return this.Vars['value'];
};

Noun.prototype.create = function(name, val) {
  this.Vars[name] = val;
  return val;
};

Noun.prototype.read = function(name) {
  return Var_Finder.Noun(this, name);
};

Noun.prototype.read_verb = function(name) {
  return Var_Finder.Noun(this, name, true);
};

Noun.prototype.update = function(name, val) {
  this.Vars[name] = val;
  return val;
};

Noun.prototype.delete = function (name) {

  if (this.Vars.hasOwnProperty(name)) {
    delete this.Vars[name];
    return true;
  };

  return false;

};

module.exports = Noun;
