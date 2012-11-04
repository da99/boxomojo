var script = require("boxomojo"),
    Parse  = require("boxomojo/lib/Parse");

module.exports.new_code = function(c) {
  return new script.Box(c);
};

module.exports.vars = function(c) {
  var box =  new script.Box(c);
  box.run();
  return box.Vars;
};

module.exports.returns = function(c) {
  var box =  new script.Box(c);
  box.run();
  return box.Returns;
};

module.exports.to_tokens = function (str) {
  return new Parse.Parser(str).tokens;
};

