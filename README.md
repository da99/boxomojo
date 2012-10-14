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

    javascript psuedo code>

      factor_script = require 'factor_script'

      box = new factor_script.Box """

        ***
          This is a comment.
          This does not place anything on the stack.
          Anything between the pair of "***" is dropped.
        ***

        *** Calculation ***
        1 + 2 + 3


        ***
          Defining a variable:
            In other words: place the string, "One", on a stack.
            execute "is:" as a function that grabs the previous
            item, "One", and the proceding item, the number 1.
            Save as a variable.
        ***

        "My-Var" is: 100


        ***

              ( )   Anything between the parenthesis is run in a separete stack
                    and the last value is returned.
                    It is equivalent to: run { }

              { }   Anonymous function.
                    Factor uses the [ ] brackets.
                    Factor_Script uses { } brackets.

              [ ]   A numbered list. Known as Array in other languages.

             k[ ]k  A stringed list. Like an Array, but with strings as indexes.
                    Known as Hash, key-value data structure in other languages.

              "s"   String. Delimiters:  " "
    s[my string]s   String. Delimiters: s[ ]s

     "^"string"^"   String escaping: ^"   "^
    s[ ^s[ ]s^ ]s   String escaping: ^s[ ]s^

        ***

        "One" is: 1

        if ( One == 1 ) {
          "Result" is: "it works"
        } else {
          "Result" is: "Factor_Script does not work"
        }

        "Array" is:           [ 0 1 2 3 4 ]
        "Optional Commas" is: [ 0 , 1 , 2 ]
        "Adding Arrays" is:   [ 1 2 3 ] + [ 4 5 6 ]

        "Number Names" is: k[
          "Zero" is: 0
          "One"  is: 1
          "Two"  is: 2
        ]k

        ^<- "New Function"
           { "str" string? } "to-number" { }
           ==> { number? }
           { ^<- "Number Names" <- str }


        "Zero" to-number

      """




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




