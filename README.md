Note:
----------

This is still being developed. It is **not** on the npm directory yet.

Factor\_Script
--------------

The Factor Programming Language is one of the best languages.
It is also why people rarely use it: It's too superior. It's
why people use SecondLife instead of OpenCroquet. It's why people
design server/client systems instead of Internet-based systems.

You tried the best. Now try the rest...  

Factor\_Script. Go forth or backward ;)


Mastering the subtle art of writing factor scripts.
-------

Get your idiot friends to teach it to you.


Installation and Usage:
-----------------------

    your_shell> npm install factor_script

    factor_script = require("factor_script")

    u = new factor_script.New """
      One is: 1 
      Six is: ( One + 5 ) 
    """
    u.run()
    vals = (v for k, v of u.data() ) 
    vals
    
    # --> ["1", 6.0]
    
    
If/else
------

    u = new factor_script.New """
      If ( true == true ) { 
        One is: 1
      } else { 
        Two is: 2 
      } 
      
    """
    u.run()
    vals = (v for k, v of u.data() ) 
    vals
    
    # --> ["1"]



Are you being forced to write code against your will?
----------------------------

You need the right languages and the right approach for you.
How? No idea. Just search online and ask different people
until you find what you are looking for.

Here are a few suggestions:
* Use [Squeak](http://www.youtube.com/results?search_query=squeak+etoys&oq=squeak+etoys). 
* Try [learning programming](http://www.khanacademy.org/cs) the traditional way.
* You can also [learn programming the hard way](http://learncodethehardway.org/).
* [A Scheme Story: High School Computing: The Inside Story](http://www.trollope.org/scheme.html)
  * [Discussion](http://news.ycombinator.com/item?id=4379482)
* [Learn Python The Hard Way](http://learnpythonthehardway.org/)

    
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


History & Disclaimers
-------

I bastardized the fantastic [Factor General Purpose Programming Language](http://factorcode.org/) for my own
personal glory. As JavaScript is to Java, Factor\_Script has no relation
to Factor.

Forgive me, [Slave Pestov](http://web.archive.org/web/20100212062526/http://factorcode.org/slava/).
(He's the cranky old dude who created the Factor language.)





