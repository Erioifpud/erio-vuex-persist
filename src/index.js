import { cover, getNestedItem } from './utils'

export default class ErioVuexPersist {
  constructor (options) {
    // 储存使用的容器
    this.storage = options.storage || window.localStorage
    // 状态储存规则
    this.rule = options.rule
    // 状态在容器中使用的键
    this.storageKey = options.storageKey || 'erio-vuex-persist'
    // 严格模式（能获得状态恢复完成的标志）
    this.strict = options.strict
    // 状态恢复函数
    this.restoreState = options.restoreState ? options.restoreState : (key, storage) => {
      const value = storage.getItem(key)
      if (typeof value === 'string') {
        return JSON.parse(value || {})
      }
      return value || {}
    }
    // 状态储存函数
    this.saveState = options.saveState ? options.saveState : (key, state, storage) => {
      storage.setItem(key, JSON.stringify(state))
    }

    // Vuex 使用的插件
    this.plugin = (store) => {
      // 从 storage 中取出数据恢复至 Vuex
      const prevState = this.restoreState(this.storageKey, this.storage)
      if (this.strict) {
        store.commit('RESTORE_MUTATION', prevState)
      } else {
        store.replaceState(cover(store.state, prevState))
      }
      let miniStore = prevState || {}

      // 根据 rule 在每一次 mutation 后将需要的状态同步至 storage
      store.subscribe((mutation, state) => {
        const { type } = mutation
        if (!(type in this.rule)) {
          return
        }
        const paths = this.rule[type]
        const tempStore = paths.reduce((a, b) => {
          const item = getNestedItem(state, b)
          if (item) {
            a[b] = item.value
          }
          return a
        }, {})

        miniStore = {
          ...miniStore,
          ...tempStore
        }
        this.saveState(this.storageKey, miniStore, this.storage)
      })
    }

    /**
     * from: https://github.com/championswimmer/vuex-persist/blob/master/src/index.ts
     * 通过 Mutation 的形式恢复状态
     * @param {Object} state Vuex 根状态对象
     * @param {Object} savedState 要恢复的局部状态
     */
    this.RESTORE_MUTATION = (state, savedState) => {
      const coverdState = cover(state, savedState || {})
      for (const propertyName of Object.keys(coverdState)) {
        this._vm.$set(state, propertyName, coverdState[propertyName])
      }
    }
  }
}
