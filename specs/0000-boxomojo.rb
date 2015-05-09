
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

    stack(results).should == [
      [
        "This is text.",
        ["This is another paragraph."]
      ]
    ]
  end # === it

  it "saves methods calls w/o blocks as meta kv" do
    results = Boxomojo.new(:css, :style).new {
      css 'happy'
      style 'red'
    }

    kv(results).should == {
      :css   => 'happy',
      :style => 'red'
    }
  end # === it

end # === describe "boxomojo"
