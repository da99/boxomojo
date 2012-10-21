
var helpers = {},
    _       = require('underscore');
    // Objects = require('factor_script/lib/Objects');

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

helpers.to_string = function(orig_tokens) {
  var tokens = orig_tokens.slice(),
  arr        = [],
  temp       = null;

  while (tokens.length !== 0)  {
    temp = tokens.shift();
    if (!temp || (!temp.kind) ) {
      arr.push(temp);
      continue;
    };

    if (temp.kind) {
      var kind = temp.kind;
      switch (kind) {

        case 'function call':
          arr.push( temp.value );
          break;

        case "func def":
          arr.push( "<+[... " + to_string(temp['function'].Tokens) +" ...]+>");
          break;

        case "function":
          arr.push( "{..}");
          break;

        case "list":
          if (temp.Returns.length > 3) {
          arr.push( '[' + to_string(temp.Returns) + ']');
          } else {
            arr.push( '[' + to_string(temp.Returns.slice(0, 3)) +' ...]');
          };
          break;

        case "index":
          arr.push( "~[... " + _.keys(temp.Vars).join(', ')  +" ...]~");
          break;

        case 'object':
          arr.push( "+[...]+");
          break;

        default:
          arr.push("[Unknown object kind]");
      }; // === switch

    };

  }; // === while

  return arr.join(' ');
};


module.exports = helpers;
