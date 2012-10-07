

// ==============================================================
//                        Numbers
// ==============================================================

var Number_Functions = FS.Number_Functions = new Noun();
Number_Functions.new_read_able("is number?", true);
Number_Functions.new_read_able('+', function (machine) {
  var l = machine.noun;
  var r = machine.grab_forward();
  return l + r;
});

Number_Functions.new_read_able('-', function (machine) {
  var l = machine.noun;
  var r = machine.grab_forward();
  return l - r;
});
