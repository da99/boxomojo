
var _ = require('underscore');

var Array_Position = function (arr, pos) {
  if (arguments.length == 1)
    pos = 'top'
  if (pos != 'top' && pos != 'bottom')
    throw new Error('Unknown array position: ' + pos);

  this.array  = arr;
  this.top    = (pos == 'top');

  if (this.top) {
    this.start = 0;
    this.end   = arr.length;
  } else {
    this.start = arr.length - 1;
    this.end   = -1
  };
  
  this.i      = this.start;
};

Array_Position.prototype.is_running = function () {
  if (this.top) 
    return this.i < this.end;
  else
    return this.i > this.end;
};

Array_Position.prototype.next = function () {
  if (this.top)
    ++this.i;
  else
    --this.i;
  
};

Array_Position.prototype.value = function () {
  return this.array[this.i];
};


module.exports = Array_Position
