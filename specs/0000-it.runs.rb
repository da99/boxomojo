
describe "boxomojo" do

  it "runs" do
    box = Boxomojo.new <<-EOF
      p
        This is text.
        p
          This is another paragraph.
        /p
      /p
    EOF
    box.define 'p' => '/p'
    box.structure.should == [
      {:stack=>["This is text.", {:stack=>["This is another paragraph."]}]}
    ]
  end # === it

end # === describe "boxomojo"
