
// ==============================================================
//                        Objects
// ==============================================================

var Obj = function (obj, func_name) {

  this.func    = obj['Functions'][func_name];
  this.value   = null;
  this.aliases = new Function_Aliases(obj, func_name);
  this.modules = new Modules(obj, func_name);
  this.sources = [ this.modules, 'self', this.aliases ];
  this.next_source();

}; // === Obj

Obj.prototype.next_source = function () {
  this.current_source =  this.sources.pop();
  return !!this.current_source;
}; // === next_source

Obj.prototype.next = function () {

  var s = this.current_source;

  if (!s)
    return false;

  if (s === 'self') {
    this.value = this.func;
    this.next_source();
    return true;
  };

  if (s.next()) {
    this.value = s.value;
    return true;
  } else {
    this.next_source();
    return this.next();
  };


}; // === next


// ==============================================================
//                       Function Aliases
// ==============================================================

var Function_Aliases = function (obj, func_name) {
  this.value  = null;
  this.list   = obj['Function Aliases'][func_name];
  this.i      = (this.list) ? this.list.length : -1;
};

Function_Aliases.prototype.next = function () {
  --this.i;
  if (this.i < 0)
    return false;
  this.value = this.list[this.i];
  return true;
};


// ==============================================================
//                      Modules
// ==============================================================

var Modules = function (obj, func_name) {
  this.sources   = obj['Modules'].slice();
  this.func_name = func_name
  this.value     = null;
  this.next_source();
};

Modules.prototype.next_source = function () {
  var mod = this.sources.pop();
  this.current = (mod) ?
    new Obj(mod['Vars'], this.func_name) :
    mod;
  return !!mod;
};

Modules.prototype.next = function () {

  var s = this.current;

  if (!s)
    return false;

  if (s.next()) {
    this.value = s.value;
    return true;
  } else {
    this.next_source();
    return this.next();
  };

};

// ==============================================================
//                        Box
// ==============================================================

var Box = function (box) {
};

Box.prototype.next = function () {
  return false;
};

module.exports = {
  Object           : Obj,
  Function_Aliases : Function_Aliases,
  Modules          : Modules,
  Box              : Box
};

