
assert = require 'assert'
Pos    = require 'factor_script/lib/Array_Position'

describe 'Array_Position',  () ->

  describe 'is_running', () ->

    it 'returns false if past last position, for top',  () ->
      pos = new Pos([0,1,2,3], 'top')
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
      assert.equal pos.is_running(), true

    it 'returns false if past last position, for bottom',  () ->
      pos = new Pos([0,1,2,3], 'bottom')
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
      assert.equal pos.is_running(), true

  describe 'value', () ->

    it 'returns value at current position, with top position', () ->
      pos = new Pos([0,1,2,3], 'top')

      assert.deepEqual pos.value(), 0

      pos.next()
      assert.deepEqual pos.value(), 1

      pos.next()
      assert.deepEqual pos.value(), 2

      pos.next()
      assert.deepEqual pos.value(), 3

    it 'returns value at current position, with bottom position', () ->
      pos = new Pos([0,1,2,3], 'bottom')

      assert.deepEqual pos.value(), 3

      pos.next()
      assert.deepEqual pos.value(), 2

      pos.next()
      assert.deepEqual pos.value(), 1

      pos.next()
      assert.deepEqual pos.value(), 0
