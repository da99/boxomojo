var script = require("factor_script"),
    Parse  = require("factor_script/lib/Parse");

module.exports.str = function(s) {
  return { "value": s, is_string: true };
};

module.exports.num = function(s) {
  return { "value": s, is_number: true };
};

module.exports.new_code = function(c) {
  return new script.Box(c);
};

module.exports.to_tokens = function (str) {
  return new Parse.Parser(str).tokens;
};

