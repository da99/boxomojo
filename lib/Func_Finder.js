
// ==============================================================
//                        Objects
// ==============================================================

var Obj = function (obj, func_name) {

  this.obj       = obj;
  this.func_name = func_name;
  this.func      = obj['Vars'][func_name];
  this.value     = null;
  this.sources   = [ 'mods', 'self', new Function_Aliases(obj, func_name) ];
  this.next_source();

}; // === Obj

Obj.prototype.next_source = function () {
  this.current_source =  this.sources.pop();
  if (this.current_source == 'mods')
    this.current_source = new Modules(this.obj, this.func_name);
  return !!this.current_source;
}; // === next_source

Obj.prototype.next = function () {

  var s = this.current_source;

  if (!s)
    return false;

  if (s === 'self') {
    this.value = this.func;
    this.next_source();
    if (!this.value)
      return this.next();
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
  this.obj    = obj;
  this.value  = null;
  this.func_name = null;
  this.list   = obj['Function Aliases'][func_name] || [];
  this.i      = this.list.length;
  this.finder = null;
};

Function_Aliases.prototype.next = function () {
  --this.i;

  if (this.i < 0)
    return false;

  this.func_name = this.list[this.i];

  if( !this.finder )
    this.finder = new Obj(this.obj, this.func_name);

  if (!this.finder.next()) 
    return false;

  this.value = this.finder.value;
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

var Box = function (box, func_name ) {
  this.box            = box;
  this.func_name      = func_name;
  this.current_source = new Obj(box, func_name);
  this.value          = null;
  this.outside_used   = false;
  this.is_done        = false;
};

Box.prototype.next = function () {
  if (this.is_done || !this.current_source)
    return false;

  if (this.current_source.next()) {
    this.value = this.current_source.value;
    return true;
  };

  if (!this.outside_used && this.box.Outside && !this.box.is_local()) {
    this.current_source = new Obj(this.box['^[]^'], this.func_name);
    this.outside_used   = true;
    return this.next();
  };

  this.is_done;
  return false;
};

module.exports = {
  Object           : Obj,
  Function_Aliases : Function_Aliases,
  Modules          : Modules,
  Box              : Box
};


