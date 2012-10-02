var _ = require("underscore");

module.exports = {
  
  'is:' : function (mess) {
    var name = mess.env.grab_backward(),
        value = mess.env.grab_forward();
    return mess.env.var_create( name, value );
  },
  
  ',' : function (mess) {
    var v = mess.env.grab_forward();
    if ( !v )
      throw new Error( ',: Nothing found after: ,' );
    return v;
  },

  'When var is missing:' : function () {
    throw new Error("missing_var: " + _.toArray(arguments) );
  }
  
};
