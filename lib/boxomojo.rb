
class Boxomojo

  module Mod

    attr_reader :stack, :meta, :kv

    def initialize name=nil, *args
      @stack = []
      @kv    = {}
      @meta  = {:name=>name, :args=>args}
    end

    def push *args
      stack.concat args
    end

    def new_box name, *args, &blok
      @stack.<<(
        self.class.new(name, *args).run(&blok)
      )
    end

    def update key, *args
      if @kv.has_key?(key)
        if @kv[key].is_a?(Array)
          @kv[key].concat args
        else
          @kv[key] = [@kv[key]].concat(args)
        end
      else
        @kv[key] = if args.size == 1
                     args.first
                   else
                     args
                   end
      end
      args
    end

    def run &blok
      instance_eval &blok
      self
    end

  end # === module Mod

  class << self
    def new *names
      c = Class.new {
        include Boxomojo::Mod
        names.each { |sym|
          eval <<-EOF, nil, __FILE__, __LINE__+1
            def #{sym} *args
              if block_given?
                new_box :#{sym}, *args, &(Proc.new)
              else
                update *args
              end # === if
            end
          EOF
        }
      }
    end
  end # === class self ===

end # === class Boxomojo ===
