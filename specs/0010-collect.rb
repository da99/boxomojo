
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
