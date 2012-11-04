
Note:
----------

This is still being developed. It is **not** on the npm directory yet.

Introduction
------------
Boxomojo allows users to add functionality to they don't own.

Installation:
-----------------------

    shell> npm install boxomojo

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
      "Result" = "Boxomojo does not work"
    }

    "Array"           = [ 0 1 2 3 4 ]
    "Optional Commas" = [ 0 , 1 , 2 ]
    "Adding Arrays"   = [ 1 2 3 ] + [ 4 5 6 ]

    "Number Names" = x[
      "Zero" = 0
      "One"  = 1
      "Two"  = 2
    ]x

    [<>] <+[
       { "str" ~~~? } "to-number" { }
       { #? }
       { [<>] x "Number Names" x str }
     ]+>


    "Zero" to-number

In your JavaScript code:


    var boxomojo = require('factor_script');
    var box = new boxomojo.Box( YOUR_FACTOR_SCRIPT_STRING );
    box.run();
    box.Returns;  // ===> Returns an Array. Treat it as a stack.
    box.Vars;     // ===> Returns an Object (aka Hash).



Commercial Break:
-----------------

[British Airways](http://www.youtube.com/watch?v=Yxbgm9Bmkzw)

[The Adventures of Buckaroo Banzai](http://www.youtube.com/watch?feature=player_detailpage&v=8MqJ3iGBdOo#t=24s)

[The Awesomeness of Factor](http://www.youtube.com/watch?v=f_0QlhYlS8g)

<!-- http://www.amazon.com/dp/B00005JKEX/?tag=miniunicom-20 -->


Advanced Features:
-----------------

* Function definitions:
    [<>] <x "my_function" , ~{ { } { } { } { } }~

* Function call routes: Called "Multiple Dispatching", "Function Overloading"
  in other languages.
    [<>] <x=y "my_function" , "new_function"


<!-- ************************************************** -->
<!-- I hope you get cancer and die you socialist swine. -->
<!-- ************************************************** -->

Ending Credits:
--------------

*Previous Name:* <br />
Factor\_Script

*Inspiration:* <br />
The [Factor General Purpose Programming Language](http://factorcode.org/).

*Written, Produced, and Directed:* <br />
by reading, pacing around, and thinking.

