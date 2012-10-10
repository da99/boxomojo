var factor_script  = require('factor_script/lib/factor_script');
var assert = require('assert');

describe('JavaScript <-> Factor_Script interface', function () {


  // it( 'has multiple-named functions', function () {
    // var m = new Factor_Script.Machine(' #{ 1 2 }# + #{ 3 4 }# ');
    // m.go_forth();
    // assert.deepEqual( m.Returns, [1,2,3,4] );
  // });

  it( 'it runs words/tokens' , function () {
    var m = new factor_script.Box("+ 2");
    assert.equal( (5).factor_script('run-verb', m), 7);
  });


  it('can add numbers', function () {
    var m = new Factor_Script.Machine("5 + 1");
    m.go_forth();
    assert.deepEqual( m.Returns, [FS.type_cast('6')]);
  });


  it('can substract numbers', function () {
    var m = new Factor_Script.Machine("5 - 1");
    m.go_forth();
    assert.deepEqual( m.Returns, [FS.type_cast('4')]);
  });


} ); // describe



