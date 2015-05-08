
describe "boxomojo" do

  it "runs" do
    results = Boxomojo.new(:p).new.run {
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
    results = Boxomojo.new(:css, :style).new.run {
      css 'happy'
      style 'red'
      css 'sad'
    }

    kv(results).should == {
      :css   => ['happy', 'sad'],
      :style => ['red']
    }
  end # === it

end # === describe "boxomojo"

describe ":block" do

  it "does not evaluate the block" do
    results = Boxomojo.new(:val, :block=>:change_to).new.run {
      val 5
      change_to { :a }
    }

    results.stack.last.args.last.class.should == Proc
  end # === it

end # === describe ":block"
