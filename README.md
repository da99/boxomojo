Note:
----------

This is still being developed. It is **not** on the npm directory yet.

Factor\_Script
--------------

The easiest to get the computer to do your bidding.


Mastering the subtle art of writing factor scripts.
-------

Get your idiot friends to teach it to you.


Installation and Usage:
-----------------------

    your_shell> npm install factor_script

    fscript = require("factor_script")

    u = new fscript.script """
      One is: 1 
      Six is: run ( One + 5 ) 
    """
    u.run()
    vals = (v for k, v of u.data() ) 
    vals
    
    # --> ["1", 6.0]
    
    
If/else
------

    u = new fscript.script """
      If ( true ) ( 
        One is: 1 
      ) else ( 
        Two is: 2 
      )
      
    """
    u.run()
    vals = (v for k, v of u.data() ) 
    vals
    
    # --> ["1"]

    
Commercial Break:
-----------------

[British Airways](http://www.youtube.com/watch?v=Yxbgm9Bmkzw)

[The Adventures of Buckaroo Banzai](http://www.youtube.com/watch?feature=player_detailpage&v=8MqJ3iGBdOo#t=24s)

<!-- [Slava Pestov on Factor](http://www.youtube.com/watch?v=f_0QlhYlS8g) -->

<!-- http://www.amazon.com/dp/B00005JKEX/?tag=miniunicom-20 -->


Ending Credits:
--------------

*Written, Produced, and Directed* <br />
by reading, pacing around, and thinking.


History & Disclaimers
-------

I bastardized the fantastic [Factor General Purpose Programming Language](http://factorcode.org/) for my own
personal glory. As JavaScript is to Java, Factor\_Script has no relation
to Factor.

Forgive me, [Slave Pestov](http://web.archive.org/web/20100212062526/http://factorcode.org/slava/).
(He's the cranky old man who created the Factor language.)


