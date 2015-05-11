
Boxomojo
----------

I use this to help make internal DSLs.

It took me 10+ years to get to this point.
I'm too tired to write anymore.


```ruby
    box_class = Boxomojo.new(:val, :names,:places)

    result = box_class.new {
      val 5
      names :happy
      names :sad
      places :glasgow
      places :oxford do
        names :apathy
        names :joy
      end
    }

    require "awesome_print"
    ap result, :indent=>-2
```


Ending Credits:
--------------

This was originally done for nodejs: [v0.1.0](https://github.com/da99/boxomojo/tree/v0.1.0)

