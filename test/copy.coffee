
h      = require 'factor_script/lib/helpers'
assert = require 'assert'
_      = require 'underscore'
objs   = require 'factor_script/lib/Objects'
fs     = require 'factor_script'

describe "Helpers: Copy", () ->

  describe 'Arrays', () ->
    it 'copys array values', () ->
      arr = [1,2,3]
      cop = h.copy(arr)
      arr.pop()
      assert.deepEqual [1,2,3], cop

    it 'copys arrays within arrays', () ->
      a = [1,2,3]
      b = [4,5,6]
      o = [a,b]
      c = h.copy [a,b]
      a.pop()
      b.pop()
      assert.deepEqual c, [[1,2,3],[4,5,6]]

  describe 'Hashs', () ->

    it "copys values", () ->
      o = { a: 'b', c: 'd' }
      c = h.copy(o)
      delete o['a']
      assert.deepEqual c, { a: 'b', c: 'd' }

    it "copys arrays within arrays", () ->
      a1 = [1,2,3]
      a2 = [4,5,6]
      a3 = [a1,a2]
      o = { a: a3, b: a3 }
      c = h.copy(o)
      a1.pop()
      a2.pop()
      a3.pop()

      assert.deepEqual c, { a: [[1,2,3],[4,5,6]], b: [[1,2,3],[4,5,6]] }

  describe 'Factor Script objects', () ->

    it "does not copy FS box", () ->
      o = new fs.Box("")
      o.Returns.is_orig = "original"
      c = h.copy(o)
      c.Returns.is_orig = "new orig"
      assert.deepEqual c.Returns.is_orig, "new orig"

    it "shallow copys 'function lists'", () ->
      o = new objs.Factor_Script_Object
      a = ['a']
      a._id = 2
      o['Function Lists'].push a
      c = h.copy(o)
      a.push 'b'

      assert.deepEqual _.last(c['Function Lists']), a







