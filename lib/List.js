var _ = require("underscore");

module.exports = List = function (new_arr) {

  this.values = [];
  this.keys   = [];

  if (new_arr) {
    
    if ( _.isArray( new_arr ) ) {
      var i = -1,
          l = new_arr.length, 
          temp = null; 
      while( ++i < l ) {
        this.push(new_arr[i]);
      };
      
    } else if ( _.isObject(new_arr) ) {
      var i = null;
      for ( i in new_arr ) {
        this.push_key_value( i, new_arr[i] );
      };
      
    };
    
  };
  
};

// ==============================================================
//                        Array Functions
// ==============================================================

List.prototype.push = function (val) {
  var i = -1, l = arguments.length;
  while( ++i < l ) {
    this.keys.push(undefined);
  };
  return this.origin("values", "push", arguments);
};

List.prototype.pop = function () {
  return this.origin_both( "pop", arguments );
};

List.prototype.shift = function() {
  return this.origin_both( "shift", arguments );
};

// ==============================================================
//                        Custom Functions
// ==============================================================

List.prototype.while_pos = function () {
  return new While_Position(this);
};
List.prototype.size = function () {
  return this.values.length;
};

List.prototype.to_array = function () {
  return this.values.slice(0);
};

List.prototype.origin = function (k, name, args) {
  return this[k][name].apply(this[k][name], args);
};

List.prototype.origin_both = function ( name, args) {
  this.keys[name].apply( this.keys[name],  args);
  return this.values[name].apply(this.values[name], args);
};

List.prototype.set_key = function (name, val) {
  var i = this.keys.indexOf(name);
  if ( i < 0 ) {
    this.keys.push(name);
    return this.values.push(val);
  } else {
    this.values[i] = val;
    return val;
  };
};

List.prototype.get_key = function (name) {
  return this.values[this.keys.indexOf(name)];
};

List.prototype.get = function (i) {
  return this.values[i];
};

// ==============================================================
//                        While_Position
// ==============================================================


module.exports.While_Position = While_Position = function (list) {
  this.list = list;
  this.i = -1;
  this.length = list.size();
};

While_Position.prototype.next = function () {
  return ++this.i;
};

While_Position.prototype.is_end = function() {
  return this.i >= this.length;
};

While_Position.prototype.i = function() {
  return this.i;
}

While_Position.prototype.key = function() {
  return this.list.keys[this.i];
};

While_Position.prototype.value = function() {
  return this.list.values[this.i];
};



