var script = require("factor_script");

module.exports.str = function(s) {
  return { "value": s, "is string?": true };
};

module.exports.new_code = function(c) {
  return new script(c);
};
  
