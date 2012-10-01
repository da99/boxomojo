var script = require("factor_script");

module.exports.str = function(s) {
  return { "value": s, is_string: true };
};

module.exports.num = function(s) {
  return { "value": s, is_number: true };
};

module.exports.new_code = function(c) {
  return new script(c);
};
  

