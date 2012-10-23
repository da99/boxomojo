
module.exports = {};
var o = module.exports;

o.fs = {
  '~[]~?' : function (box) { return box.respond(true); },
  'x'    : function (box) { return box.target.Vars[box.grab_forward()]; }
};

o.js = {
};
