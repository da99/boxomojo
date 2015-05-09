
describe "boxomojo" do

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

describe ":block" do

  it "does not evaluate the block" do
    results = Boxomojo.new(:val, :block=>:change_to).new {
      val 5
      change_to { :a }
    }

    results.stack.last.args.last.class.should == Proc
  end # === it

end # === describe ":block"

describe ":collect" do

  it "collects value rather than updates value" do
    results = Boxomojo.new(:val, :collect=>[:names,:places]).new {
      val 5
      names :happy
      names :sad
      places :glasgow
      places :oxford
    }

    results.kv.should == {:val=>5, :names=>[:happy,:sad], :places=>[:glasgow, :oxford]}
  end # === it

end # === describe ":collect"
