

Factor\_Script: Go forth or backward ;)
--------------

Factor\_Script is a problem-orientated language (aka POL, DSL) for adding functionality to a
website I am working on.  JavaScript has almost-non-existent sandboxing features and I am afraid to use [ADSafe](http://adsafe.org/),
so I had to create my own alternative.  Factor\_Script is not meant to be a way to generate JavaScript. It is meant 
to be a sandbox on top of JavaScript. (Similar to [Quby](http://www.playmycode.com/docs/quby#s_about).) Libraries will be used to create fully functioning web apps: database access, 
HTML/CSS creation, and scripting.

Factor\_Script is inspired by Factor [Factor General Purpose Programming Language](http://factorcode.org/).
Any connection to Factor stops there.  Factor\_Script has been made without the approval of the Factor 
community and its creator, [Slave Pestov](http://web.archive.org/web/20100212062526/http://factorcode.org/slava/).

I chose Factor language because it is the best languages I have ever seen.
It is also why people rarely use it: It's too superior. It's
why people use SecondLife instead of OpenCroquet. It's why people
design server/client systems instead of Internet-based systems. Superiority is different, freightening, and unwelcomed. Mediocrity is 
incremental, familiar, and desired. Which explains the popularity of: [censored: name of mediocre scripting languages].



The beginning...
===============

Originally, I wanted to use Factor to create megauni. However, 
I decided the libraries of Ruby were developing very fast. I then
decided to use JavaScript. 

Originally, the name changed from UniLang to i\_love\_u.  Now,
it is Factor\_Script. This version of the language is based on
parts of the Factor language, not the compiler or object system. 
The previous version (UniLang/i\_love\_u) was more influenced by 
HyperTalk and some inspiration by Factor. That version was meant to
allow the programmer to mold the language into English, Japanese, Spanish,
etc.

Factor\_Script is more strict: it forces you to be clear, not familiar (e.g.
English, Spanish, Japanese, etc). Yet, it does have some flexibility:
you can be postfix or prefix.

Variables are introduced as key/value settings in the current environment 
(aka scope). This is a bending towards the will of the user because the 
user/programmer is not willing to embrace the awesomeness of 
concatentive, stack based architecture.

More on the naming...
=====================

Previous name: The Universal Programming Language. 

I started implementing it as a Ruby gem, [Uni\_Lang](https://github.com/da99/Uni_Lang), 
but I switched entirely to Coffeescript on Node.js. CoffeeScript is a good enough
Ruby.

Why the stupid name?: i\_love\_u
-------------------

As a practical joke on all overpaid, idiot middle managers telling their 
overlords they will be implementating "the solution with i love u."

Also, people love stupid. People love outrageous. When your goal in life 
is to pro-create in the suburbs, your standards in entertainment are 
toddler-like.



