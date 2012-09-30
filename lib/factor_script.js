
// module.exports = {
  // "New" : function () {
    // var s = {}
    // s["is a factor script?"] = function () { return true; }
    // return s;
  // }
// }

module.exports = script = { 
  New: function (code) {
    var original_code = code;
    this["original code"] = function () { return original_code; };
    this["code"]          = function () { return code; };
    this["is a factor script?"] = function () { return true; }
    return this;
  }
};

script.New.prototype.parse = function () {
  var raw_arr = this["code"]().split(/(\s+)/),
      arr     = [], 
      temp    = null;

  while( temp = raw_arr.shift() ) {
    if( temp.trim() != "" )
      arr.push(temp);
  };

  return arr;
}


