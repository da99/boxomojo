
describe "boxomojo" do

  it "runs code from README.md" do
    file     = File.expand_path(File.dirname(__FILE__) + '/../README.md')
    contents = File.read( file )
    code     = (contents[/```ruby([^`]+)```/] && $1).
      split("\n").
      reject { |l| l['ap '] }.
      join("\n")

    should.not.raise {
      eval(code, nil, file, contents.split("\n").index('```ruby') + 1)
    }
  end # === it

  it "runs" do
    results = Boxomojo.new(:p).new {
      p {
        push "This is text."
        p {
          push "This is another paragraph."
        }
      }
    }

    results.should == [
      [
        :p, [], [
          "This is text.",
          [:p, [], ["This is another paragraph."]]
        ]
      ]
    ]
  end # === it

  it "saves methods calls w/o blocks" do
    results = Boxomojo.new(:css, :style).new {
      css 'happy'
      style 'red'
    }

    results.should == [
      [:css,   ['happy'], nil],
      [:style, ['red'],   nil]
    ]
  end # === it

end # === describe "boxomojo"

describe ":block" do

  it "does not evaluate the block" do
    p = Proc.new { something }
    results = Boxomojo.new(:val, :block=>:change_to).new {
      val 5
      change_to(&p)
    }

    results.should == [
      [:val, [5], nil],
      [:change_to, [], p]
    ]
  end # === it

end # === describe ":block"


