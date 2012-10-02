var _ = require("underscore");

module.exports = {
  
  'is:' : function (mess) {
    var name = mess.env.stack().pop(),
        value = mess.env.stack('tokens').shift();
    return mess.env.var_create( name, value );
  },
  
  'When var is missing:' : function () {
    throw new Error("var is missing:" + _.toArray(arguments) );
  }
  
};
