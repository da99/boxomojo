var B  = require("boxomojo").Boxomojo,
Parser = require("boxomojo/lib/Parser").Parser
;

module.exports.vars = function(c) {
  var box =  B.new(c);
  box.run();
  return box.Vars;
};

module.exports.returns = function(c) {
  var box =  Box.new(c);
  box.run();
  return box.Returns;
};

module.exports.to_tokens = function (str) {
  return Parser.new(str).tokens;
};

