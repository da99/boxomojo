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
    
      Factor_Script = require 'factor_script'
      
      machine = new Factor_Script.Machine """
      
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

        "One" is: 1


        ***
        
            ( )   Anything between the parenthesis is run in a separete stack
                  and the last item is returned.
                  It is equivalent to: run { }
                  
            { }   Anonymous function. Factor uses the square brackets, Factor_Script
                  uses curly brackets.

            [ ]   A numbered list. Known as Array in other languages.

           w[ ]w  A worded list. Known as Hash, key-value data structure in other languages.
          
        ***
        
        if ( One == 1 ) {
          "Result" is: "it works"
        } else {
          "Result" is: "Factor_Script does not work"
        }

        "Array" is:           [ 0 1 2 3 4 ]
        "Optional Commas" is: [ 0 , 1 , 2 ]
        "Added Array" is:     [ 1 2 3 ] + [ 4 5 6 ]

        "Number Names" is: w[
          "Zero" is: 0
          "One"  is: 1
          "Two"  is: 2
        ]w

        ^<- "New Function"
           [ "str" "string?" ] "to-number" [ ] ==> [ "number?" ]
           { ^<- "Number Names" index str }


        "Zero" to-number *** Places 0 on the stack. ***
        
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




