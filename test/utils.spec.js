import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import { setNestedItem, getNestedItem, cover, isNotObject } from '../src/utils'

describe('isNotObject 单元测试', () => {
  it('传入数值', () => {
    expect(isNotObject(1)).to.equal(true)
    expect(isNotObject(NaN)).to.equal(true)
  })
  it('传入字符串', () => {
    expect(isNotObject('')).to.equal(true)
  })
  it('传入布尔值', () => {
    expect(isNotObject(true)).to.equal(true)
    expect(isNotObject(false)).to.equal(true)
  })
  it('传入 undefined 与 null', () => {
    expect(isNotObject(null)).to.equal(true)
    expect(isNotObject(undefined)).to.equal(true)
  })
  it('传入对象', () => {
    expect(isNotObject({})).to.equal(false)
    expect(isNotObject([])).to.equal(false)
  })
})

describe('cover 单元测试', () => {
  it('使用空 pathKeyState 覆盖空 rootState', () => {
    expect(cover({}, {})).to.deep.equal({})
  })

  it('使用空 pathKeyState 覆盖 rootState', () => {
    const rootState = {
      channels: [
        { id: 1, name: 'Channel1' },
        { id: 2, name: 'Channel2' }
      ],
      channelId: 1
    }
    expect(cover(rootState, {})).to.deep.equal(rootState)
  })

  it('使用 pathKeyState 覆盖空 rootState', () => {
    const pathKeyState = {
      'settings.user.id': 100,
      'settings.user.name': 'Erio',
      'settings.editable': true
    }
    expect(cover({}, pathKeyState)).to.deep.equal({})
  })

  it('使用 pathKeyState 覆盖 rootState', () => {
    const rootState = {
      channels: [
        { id: 1, name: 'Channel1' },
        { id: 2, name: 'Channel2' }
      ],
      channelId: 1,
      settings: {
        user: {
          id: 100,
          name: 'Erio'
        },
        editable: true
      }
    }
    const pathKeyState = {
      'settings.user.id': 30,
      'settings.user.name': 'Oire',
      'channels': [],
      'channelId': undefined
    }
    expect(cover(rootState, pathKeyState)).to.deep.equal({
      channels: [],
      channelId: undefined,
      settings: {
        user: {
          id: 30,
          name: 'Oire'
        },
        editable: true
      }
    })
  })
})

describe('getNestedItem 单元测试', () => {
  let obj

  beforeEach(() => {
    obj = {
      settings: {
        user: {
          id: 100,
          name: 'Erio'
        }
      }
    }
  })

  it('上下文 ctx 不为对象', () => {
    expect(getNestedItem(null)).to.be.undefined
    expect(getNestedItem(undefined)).to.be.undefined
    expect(getNestedItem(1)).to.be.undefined
    expect(getNestedItem('')).to.be.undefined
    expect(getNestedItem(true)).to.be.undefined
  })

  it('上下文 ctx 为空对象', () => {
    expect(getNestedItem({})).to.be.undefined
    expect(getNestedItem({}, '')).to.be.undefined
  })

  it('上下文 ctx 不为空对象，路径 path 不存在', () => {
    expect(getNestedItem(obj, 'channels')).to.be.undefined
    expect(getNestedItem(obj, 'settings.editable')).to.be.undefined
    expect(getNestedItem(obj, '')).to.be.undefined
  })

  it('上下文 ctx 不为空对象，路径 path 存在', () => {
    expect(getNestedItem(obj, 'settings.user.id').value).to.equal(100)
    expect(getNestedItem(obj, 'settings.user.name').value).to.equal('Erio')
    expect(getNestedItem(obj, 'settings.user').value).to.deep.equal({
      id: 100,
      name: 'Erio'
    })
  })
})

describe('setNestedItem 单元测试', () => {
  let obj

  beforeEach(() => {
    obj = {
      settings: {
        user: {
          id: 100,
          name: 'Erio'
        }
      }
    }
  })

  it('上下文 ctx 不为对象', () => {
    let r1 = null
    let r2 = undefined
    let r3 = 1
    let r4 = ''
    let r5 = true
    setNestedItem(r1)
    setNestedItem(r2)
    setNestedItem(r3)
    setNestedItem(r4)
    setNestedItem(r5)
    expect(r1).to.be.null
    expect(r2).to.be.undefined
    expect(r3).to.eq(1)
    expect(r4).to.eq('')
    expect(r5).to.be.true
  })

  it('上下文 ctx 为空对象', () => {
    let r1 = {}
    let r2 = {}
    getNestedItem(r1)
    getNestedItem(r2, '')
    expect(r1).to.deep.equal({})
    expect(r2).to.deep.equal({})
  })

  it('上下文 ctx 不为空对象，路径 path 为空', () => {
    const copiedObj = JSON.parse(JSON.stringify(obj))
    setNestedItem(copiedObj, '', 123)
    expect(copiedObj).to.deep.equal(obj)
  })

  it('上下文 ctx 不为空对象，路径 path 不为空', () => {
    const copiedObj1 = JSON.parse(JSON.stringify(obj))
    const copiedObj2 = JSON.parse(JSON.stringify(obj))
    const copiedObj3 = JSON.parse(JSON.stringify(obj))
    setNestedItem(copiedObj1, 'settings.user.id', 123)
    setNestedItem(copiedObj2, 'settings.user.name', 'Oire')
    setNestedItem(copiedObj3, 'settings.user', undefined)
    expect(copiedObj1).to.deep.equal({
      settings: {
        user: {
          id: 123,
          name: 'Erio'
        }
      }
    })
    expect(copiedObj2).to.deep.equal({
      settings: {
        user: {
          id: 100,
          name: 'Oire'
        }
      }
    })
    expect(copiedObj3).to.deep.equal({
      settings: {
        user: undefined
      }
    })
  })
})
