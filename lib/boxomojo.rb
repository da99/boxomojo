
class Boxomojo

  module Mod

    attr_reader :stack, :meta, :kv

    def initialize name=nil, *args
      @stack = []
      @kv    = {}
      @meta  = {:name=>name, :args=>args}
      run(&Proc.new) if block_given?
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

    def update key, arr
      if arr.size == 1 || arr.empty?
        @kv[key] = arr.first
      else
        @kv[key] = arr
      end
      arr
    end

    def collect key, arr
      if !@kv.has_key?(key)
        @kv[key] = []
      end

      @kv[key].concat arr
      arr
    end

    def run &blok
      instance_eval &blok
      self
    end

  end # === module Mod

  class << self
    def new *names
      kv = if names.last.is_a?(Hash)
             h = names.pop
             h[:names] = names
             h
           else
             {:names=>names}
           end

      c = Class.new {
        include Boxomojo::Mod
        kv.each { |k, sym_or_arr|
          arr = [sym_or_arr].flatten

          case k
          when :names
            arr.each { |name|
              eval <<-EOF, nil, __FILE__, __LINE__+1
                def #{name} *args
                  if block_given?
                    new_box :#{name}, *args, &(Proc.new)
                  else
                    update :#{name}, args
                  end # === if
                end
              EOF
            }

          when :block
            arr.each { |name|
              eval <<-EOF, nil, __FILE__, __LINE__ + 1
                def #{name} *args, &blok
                  new_box :#{name}, *args, blok
                end
              EOF
            }

          when :collect
            arr.each { |name|
              eval <<-EOF, nil, __FILE__, __LINE__+1
                def #{name} *args
                  collect :#{name}, args
                end
              EOF
            }

          else
            fail ArgumentError, "Unknow type: #{k.inspect}"

          end # === case k
        }
      }
    end
  end # === class self ===

end # === class Boxomojo ===
