import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import Vuex from 'vuex'
import Vue from 'vue'
import ErioVuexPersist from '../src/'

Vue.use(Vuex)

const createStore = (erioVuexPersist) => {
  return new Vuex.Store({
    state: {
      counter: {
        value1: 1,
        value2: 2
      },
      value3: 3
    },
    mutations: {
      increase (state) {
        state.counter.value1 += 1
        state.counter.value2 += 1
        state.value3 += 1
      },
      double (state) {
        state.counter.value1 *= 2
        state.counter.value2 *= 2
        state.value3 *= 2
      },
      RESTORE_MUTATION: erioVuexPersist.RESTORE_MUTATION
    },
    plugins: [erioVuexPersist.plugin]
  })
}

describe('ErioVuexPersist 功能测试', () => {
  let erioVuexPersist

  beforeEach(() => {
    erioVuexPersist = new ErioVuexPersist({
      storage: global.localStorage,
      rule: {
        'increase': [
          'counter.value1',
          'value3'
        ],
        'double': [
          'counter.value1',
          'value3'
        ]
      },
      storageKey: 'evp'
    })
  })

  it('非严格模式，从 LocalStorage 中恢复状态', () => {
    const store = createStore(erioVuexPersist)
    store.commit('increase')
    const stored = global.localStorage.getItem('evp')
    expect(stored).to.eq(JSON.stringify({
      'counter.value1': 2,
      'value3': 4
    }))
  })
})
