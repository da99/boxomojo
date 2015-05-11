
class Boxomojo

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

        class << self # ==============

          def new
            super(&(Proc.new)).stack
          end

        end # === class << self ======

        attr_reader :stack

        def initialize name=nil, *args
          @stack = []
          instance_eval(&Proc.new)
        end

        def push *args
          @stack.concat args
        end


        kv.each { |k, sym_or_arr|
          arr = [sym_or_arr].flatten

          case k
          when :names
            arr.each { |name|
              eval <<-EOF, nil, __FILE__, __LINE__+1
                def #{name} *args
                  if block_given?
                    arr = []
                    orig = @stack
                    @stack = arr
                    instance_eval &(Proc.new)
                    @stack = orig
                    @stack << [:#{name}, args, arr]
                  else
                    @stack << [:#{name}, args, nil]
                  end # === if
                end
              EOF
            }

          when :block
            arr.each { |name|
              eval <<-EOF, nil, __FILE__, __LINE__ + 1
                def #{name} *args, &blok
                  @stack << [:#{name}, args, blok]
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
