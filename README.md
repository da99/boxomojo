
Note:
----------

This is still being developed. It is **not** on the npm directory yet.

Introduction
------------
Boxomojo allows users to run code from other people in your web-page.
It does not compile to JavaScript. Instead, it is run by JavaScript.
It sandboxes that code. (eg an alternative to [Adsafe](http://www.adsafe.org/)).

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

          [ ]   A list. Known as Array in other languages. (This is not a linked
                list. It is named "list" because Boxomojo is meant for humans,
                not programmers.)

          { }   A box. Think of it a Hash/Dictionary that is also an object.
                Example:
                { 
                   a = "some val"
                   b = "other val"
                   c = 123
                }


          "s"       String. Delimiters:  " "
         &[ ]&      String. Example:  &[ my "crazy" $!@#%^&* 'string' ]&

     "^"string"^"   String escaping: ^"   "^
    &[ ^&[ ]&^ ]&   String escaping: ^&[ ]&^

        [<>]    Inside box. Known as "local scope" in other languages.
        ^[]^    Outside box.

    !!!

    "One" = 1

    if ( One =? 1 ) {
      "Result" = "it works"
    } else {
      "Result" = "Boxomojo does not work"
    }

    "Array"           = [ 0 1 2 3 4 ]
    "Optional Commas" = [ 0 , 1 , 2 ]
    "Adding Arrays"   = [ 1 2 3 ] + [ 4 5 6 ]

    "Number Names" = {
      "Zero" = 0
      "One"  = 1
      "Two"  = 2
    }

    "to-number" =f {
       "Number Names" : Left_Stack_Pop
    }


    "Zero" to-number

In your JavaScript code:


    var Boxomojo = require('boxomojo').Boxomojo;
    var box = Boxomojo.new( YOUR_FACTOR_SCRIPT_STRING );
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
    "my_function" = { print "a" }

* Function call routes: Called "Multiple Dispatching", "Function Overloading"
  in other languages.
    extend "+" with: "+_for_cars" =f {
      "car_a" <stack_pop> "car_b"
      if ( ( car_a : type not= 'Car' ) or ( car_b : type not= 'Car' ) ) [
        Push_back_and_pass.
      ]
      #!  Your code here.
    }


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

