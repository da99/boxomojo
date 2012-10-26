Note:
----------

This is still being developed. It is **not** on the npm directory yet.

Disclaimer:
-----------

Factor\_Script was inspired by the [Factor General Purpose Programming Language](http://factorcode.org/).
Howevere, they have no further relation beyond that.  The Factor Community is not even aware this project
exists.

Installation:
-----------------------

    shell> npm install factor_script

Use:
-----------------------
In a string or a file:

    #!!!
      This is a comment.
      This does not place anything on the stack.
      Anything between "#!!!", "!!!" is dropped
      during parsing.
    !!!

    #! This is also another comment.
    #! It ends at the end of the line.
    #! It gets dropped during parsing, just like #!!! !!!
    #! Note the space: "#!_Note_the_space"

    #! Calculation
    1 + 2 + 3


    #!!!
      Defining a variable:
        1) In other words: place the string, "One", on a stack.
        2) Execute "=" as a function that grabs the previous
        item, "One", and the proceding item, the number 1.
        3) Save as a variable.
    !!!

    "My-Var" = 100


    #!!!

          ( )   Anything between the parenthesis is run in a separete stack
                and the last value is returned.
                It is equivalent to: run { [<>] update: ^[]^  }

          { }   Anonymous function.
                Factor uses the [ ] brackets.
                Factor_Script uses { } brackets.

          [ ]   A list. Known as Array in other languages.

         x[ ]x  A box. Think of it a Hash/Dictionary that is also an object.

          "s"       String. Delimiters:  " "
         &[ ]&      String. Example:  &[ my "crazy" $!@#%^&* 'string' ]&

     "^"string"^"   String escaping: ^"   "^
    &[ ^&[ ]&^ ]&   String escaping: ^&[ ]&^

        [<>]    Inside box. Known as "local scope" in other languages.
        ^[]^    Outside box.

    !!!

    "One" = 1

    if ( One == 1 ) {
      "Result" = "it works"
    } else {
      "Result" = "Factor_Script does not work"
    }

    "Array"           = [ 0 1 2 3 4 ]
    "Optional Commas" = [ 0 , 1 , 2 ]
    "Adding Arrays"   = [ 1 2 3 ] + [ 4 5 6 ]

    "Number Names" = u[
      "Zero" = 0
      "One"  = 1
      "Two"  = 2
    ]u

    [<>] <+[
       { "str" ~~~? } "to-number" { }
       { #? }
       { [<>] get "Number Names" get str }
     ]+>


    "Zero" to-number

In your JavaScript code:


    var factor_script = require('factor_script');
    var box = new factor_script.Box( YOUR_FACTOR_SCRIPT_STRING );
    box.run();
    box.Returns;  // ===> Returns an Array. Treat it as a stack.
    box.Vars;     // ===> Returns an Object (aka Hash).



Commercial Break:
-----------------

[British Airways](http://www.youtube.com/watch?v=Yxbgm9Bmkzw)

[The Adventures of Buckaroo Banzai](http://www.youtube.com/watch?feature=player_detailpage&v=8MqJ3iGBdOo#t=24s)

[The Awesomeness of Factor](http://www.youtube.com/watch?v=f_0QlhYlS8g)

<!-- http://www.amazon.com/dp/B00005JKEX/?tag=miniunicom-20 -->


Ending Credits:
--------------

*Written, Produced, and Directed* <br />
by reading, pacing around, and thinking.




