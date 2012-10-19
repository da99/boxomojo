
var helpers = {},
    _       = require('underscore'),
    Objects = require('factor_script/lib/Objects');

helpers.is_number = function (o) {
  return(_.isNumber(o) && !_.isNaN(o));
};

helpers.copy = function (o) {

  if ( !o || _.isNumber(o) || _.isString(o) || _.isBoolean(o) || _.isFunction(o) )
    return o;

  if (!o.hasOwnProperty('is_box') && o.is_box && o.is_box())
    return o;

  if (_.isArray(o)) {
    var i = -1, len = o.length;
    var new_arr = [];
    while (++i < len) {
      new_arr.push( helpers.copy(o[i]) );
    };
    return new_arr;

  } else {
    var new_obj = (o.is_factor_script_object()) ? 
      (new Objects.Base()) :
      {};
    var k       = null;
    for (k in o) {
      if( (k == 'Modules') && o.is_factor_script_object()) {
        new_obj[k] = o[k].slice()
      } else {
        if( o.hasOwnProperty(k) )
          new_obj[k] = helpers.copy(o[k]);
      };
    };
    return new_obj;
  };

  throw new Error("Don't know how to copy: " + o);
};

module.exports = helpers;
