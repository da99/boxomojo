
var helpers = {},
    _       = require('underscore');

helpers.copy = function (o) {

  if (_.isNumber(o) || _.isString(o) || _.isBoolean(o) || _.isFunction(o) )
    return o

  if (_.isArray(o)) {

    var i = -1, len = o.length;
    var new_arr = [];
    while (++i < len) {
      new_arr.push( helpers.copy(o[i]) );
    };
    return new_arr;

  } else {
    var new_obj = {}, k = null;
    for (k in o) {
      if( o.hasOwnProperty(k) )
        new_obj[k] = helpers.copy(o[k]);
    };
    return new_obj;
  };

  throw new Error("Don't know how to copy: " + o);
};

module.exports = helpers;
