var script = require("factor_script"),
    Parse  = require("factor_script/lib/Parse");

module.exports.new_code = function(c) {
  return new script.Box(c);
};

module.exports.returns = function(c) {
  var box =  new script.Box(c);
  box.run();
  return box.Returns;
};

module.exports.to_tokens = function (str) {
  return new Parse.Parser(str).tokens;
};

