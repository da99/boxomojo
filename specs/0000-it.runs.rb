
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

end # === describe "boxomojo"
