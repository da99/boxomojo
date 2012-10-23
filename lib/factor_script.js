
var _           = require('underscore'),
    h           = require('factor_script/lib/helpers'),
    Parse       = require('factor_script/lib/Parse'),
    Pos         = require('factor_script/lib/Array_Position'),
    Boxs        = require('factor_script/lib/Boxs'),
    Func_Finder = require('factor_script/lib/Func_Finder');


// ==============================================================
//                        Box
// ==============================================================

var Box = Boxs['o[]o'];


// ==============================================================
//                        Box Prototype
// ==============================================================


var factor_script = function (code) { };
factor_script.Box = Box;
module.exports    = factor_script;





