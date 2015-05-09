

describe ":block" do

  it "does not evaluate the block" do
    results = Boxomojo.new(:val, :block=>:change_to).new {
      val 5
      change_to { :a }
    }

    results.stack.last.args.last.class.should == Proc
  end # === it

end # === describe ":block"
