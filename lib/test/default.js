
module.exports.str = function(s) {
  return { "value": s, "is string?": true };
};

module.exports.new_code = function(c) {
  return new script.New(c);
};
  
