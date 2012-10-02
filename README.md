Note:
----------

This is still being developed. It is **not** on the npm directory yet.

Factor\_Script: Go forth or backward ;)
--------------

Factor\_Script is a problem-orientated language (aka POL, DSL) for adding functionality to a
website I am working on.  JavaScript has almost-non-existent sandboxing features and I am afraid to use [ADSafe](http://adsafe.org/),
so I had to create my own alternative.  Factor\_Script is not meant to be a way to generate JavaScript. It is meant 
to be a sandbox on top of JavaScript. Libraries will be used to create fully functioning web apps: database access, 
HTML/CSS creation, and scripting.

Factor\_Script is inspired by Factor [Factor General Purpose Programming Language](http://factorcode.org/).
Any connection to Factor stops there.  Factor\_Script has been made without the approval of the Factor 
community and its creator, [Slave Pestov](http://web.archive.org/web/20100212062526/http://factorcode.org/slava/).

I chose Factor language because it is the best languages I have ever seen.
It is also why people rarely use it: It's too superior. It's
why people use SecondLife instead of OpenCroquet. It's why people
design server/client systems instead of Internet-based systems. Superiority is different, freightening, and unwelcomed. Mediocrity is 
incremental, familiar, and desired. Which explains the popularity of: VBScript, PHP, and Ruby.

I am also not a programmer. I have no formal education on software, hardware, 
history, religion, economics, etiquette, English, basic hygiene, etc. 


Mastering the subtle art of writing factor scripts.
-------

Get your idiot friends to teach it to you.


Installation and Usage:
-----------------------

    your_shell> npm install factor_script

    factor_script = require("factor_script")

    u = new factor_script """
      One is: 1 
      Six is: ( One + 5 ) 
    """
    u.run()
    vals = (v for k, v of u.data() ) 
    vals
    
    # --> ["1", 6.0]
    
    
If/else
------

    u = new factor_script """
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




