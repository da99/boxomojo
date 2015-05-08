
require 'Bacon_Colored'
require 'boxomojo'
require 'pry'
require 'awesome_print'

def awesome *args
  args.each { |v|
    ap v, :indent=>-2
  }
end

def stack box
  box.stack.map { |b|
    if b.is_a?(Boxomojo::Mod)
      stack(b)
    else
      b
    end
  }
end
