
var _  = require('underscore')
Parser = require('boxomojo/lib/Parser.js').Parser
;


var B = exports.Boxomojo = function () { };

B.new = function (str) {
  var b    = new B();
  b.Code   = str;
  b.is_box = true;
  b.Parser = Parser.new(str);
  b.Tokens = b.Parser.tokens;
  return b;
};

B.prototype.run = function () {
  throw new Error('not done');
  console['log'](this.Tokens);
};



