
class Boxomojo

  module Mod

    attr_reader :stack, :meta, :kv

    def initialize name=nil, *args
      @stack = []
      @kv    = {}
      @meta  = {:name=>name, :args=>args}
    end

    def name
      @meta[:name]
    end

    def args
      @meta[:args]
    end

    def push *args
      stack.concat args
    end

    def new_box name, *args
      box = self.class.new(name, *args)
      if block_given?
        box.run(&(Proc.new))
      end
      @stack.<<( box )
    end

    def update key, *args
      if @kv.has_key?(key)
        if @kv[key].is_a?(Array)
          @kv[key].concat args
        else
          @kv[key] = [@kv[key]].concat(args)
        end
      else
        @kv[key] = args
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
          if sym.is_a?(Hash)
            sym.each { |k, v|
              case
              when :block
                [v].flatten.each { |name|
                  eval <<-EOF, nil, __FILE__, __LINE__ + 1
                    def #{name} *args, &blok
                      new_box :#{name}, *args, blok
                    end
                  EOF
                }
              else
                fail ArgumentError, "Unknow type: #{k.inspect}"
              end
            }
            next
          end

          eval <<-EOF, nil, __FILE__, __LINE__+1
            def #{sym} *args
              if block_given?
                new_box :#{sym}, *args, &(Proc.new)
              else
                update :#{sym}, *args
              end # === if
            end
          EOF
        }
      }
    end
  end # === class self ===

end # === class Boxomojo ===
