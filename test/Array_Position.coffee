
assert = require 'assert'
Pos    = require 'boxomojo/lib/Array_Position'

describe 'Array_Position',  () ->

  describe 'is_running', () ->

    it 'returns false if past last position, for top',  () ->
      pos = new Pos([0,1,2,3], 'top')
      pos.next()
      pos.next()
      pos.next()
      pos.next()
      pos.next()
      assert.equal pos.is_running(), false

    it 'returns true if at last position, for top',  () ->
      pos = new Pos([0,1,2,3], 'top')
      pos.next()
      pos.next()
      pos.next()
      pos.next()
      assert.equal pos.is_running(), true

    it 'returns false if past last position, for bottom',  () ->
      pos = new Pos([0,1,2,3], 'bottom')
      pos.next()
      pos.next()
      pos.next()
      pos.next()
      pos.next()
      assert.equal pos.is_running(), false

    it 'returns true if at last position, for bottom',  () ->
      pos = new Pos([0,1,2,3], 'bottom')
      pos.next()
      pos.next()
      pos.next()
      pos.next()
      assert.equal pos.is_running(), true

  describe 'value', () ->

    it 'returns value at current position, with top position', () ->
      arr = [0,1,2,3]
      copy= arr.slice()
      pos = new Pos(arr, 'top')

      while(pos.next())
        assert.deepEqual pos.value(), copy.shift()

    it 'returns value at current position, with bottom position', () ->
      arr = [0,1,2,3]
      copy= arr.slice()
      pos = new Pos(arr, 'bottom')

      while(pos.next()) 
        assert.deepEqual pos.value(), copy.pop() 

  describe 'next', () ->

    it 'returns true until past of lenght of array, for top', () ->
      arr = [0,1,2,3]
      pos = new Pos(arr, 'top')
      assert.equal pos.next(), true
      assert.equal pos.next(), true
      assert.equal pos.next(), true
      assert.equal pos.next(), true
      assert.equal pos.next(), false

    it 'returns true until past of lenght of array, for bottom', () ->
      arr = [0,1,2,3]
      pos = new Pos(arr, 'bottom')
      assert.equal pos.next(), true
      assert.equal pos.next(), true
      assert.equal pos.next(), true
      assert.equal pos.next(), true
      assert.equal pos.next(), false

