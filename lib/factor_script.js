/*
 Strings
 Numbers
 Objects
   # Lists
     Read-Only: true
   w Lists
     Read-Only: true
   Functions
   Function Runs
   Pages
   Function List
   DESIGN:
     Values
     Value:
     Vars:
     AboutL

*/

var _       = require("underscore"),
    xregexp = require("xregexp").XRegExp
    kernel  = null,
    factor_script = null;

factor_script = function (code) {
  this.Main = Page.send_message( { 
    verb: 'new'
  });
  this.Main.run( "code-is", code );
};


function New_Noun () {
  var o = this;
  o.Returns = [],
  o.Value   = undefined,
  o.Verbs   = [],
  o.Nouns   = {},
  o['About:'] = {
    'function lists' : [], // also acts as 'place to forward missing var to' 
    'read_able'      : {},
    'verbs'       : null,
    'has run?'    : false,
    'write_able'  : {}
  }

  return o;
};

New_Noun.prototype.run = function (str_or_mess) {
  var mess = new New_Noun();
  mess.new_read_able( 'is message?', true);
  mess.new_read_able( 'verb', null);
  
  mess.new_read_able( 'source', null);
  mess.new_read_able( 'original source', null);
  
  mess.new_read_able( 'target', null);
  mess.new_read_able( 'original target', null);
  
  mess.new_read_able( 'Returns', null);
  mess.new_read_able( '', null);
  
  if ( ! str_or_mess.is_noun ) {
    for ( var i in str_or_mess ) {
      mess.update( i, str_or_mess[i] );
    };
    mess.new_read_able( 'source', 'JavaScript' );
    mess.new_read_able( 'original source', 'JavaScript' );
    mess.new_read_able( 'target', this );
    mess.new_read_able( 'original target', this );
  } else 
    mess = str_or_mess;

};

New_Noun.prototype.is_noun = true;

New_Noun.prototype.update = function (name, val) {
  if ( ! _.has(this['Nouns'] )  {
    throw new Error( 'update: Noun not defined: ' + name );
  };

  this.Nouns[name] = val;
  return this;
};

New_Noun.prototype.new_read_able = function ( name, val ) {
  this.Nouns[name] = val;
  this['About:']['read_able'][name] = true;
  return this;
};



ON['Nouns']['#{}#'] = new factor_script.Noun();
ON['Nouns']['w{}w'] = new factor_script.Noun();
ON['Nouns']['{}']   = new factor_script.Noun();
ON['Nouns']['Page'] = new factor_script.Noun();





module.exports = factor_script;


  


