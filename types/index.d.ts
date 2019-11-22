import { Store, Mutation } from 'vuex'

export interface PersistRule {
  [path: string]: Array<string>
}

export interface PersistOptions<S> {
  /**
   * 储存使用的容器
   */
  storage?: Storage

  /**
   * 状态储存规则
   */
  rule: PersistRule

  /**
   * Vuex 状态在容器 storage 中使用的键
   */
  storageKey: string

  /**
   * 设置是否开启严格模式
   * 在严格模式下能通过 subscribe 获取到 Vuex 状态恢复完成的标志
   */
  strict?: boolean

  /**
   * 从容器 storage 中查询状态的方法
   * @param key
   * @param [storage]
   */
  restoreState?: (key: string, storage?: Storage) => S

  /**
   * 将状态存入容器 storage 中的方法
   * @param key
   * @param state
   * @param [storage]
   */
  saveState?: (key: string, state: {}, storage?: Storage) => void
}

export declare class ErioVuexPersist<S> {
  constructor (options: PersistOptions<S>)

  plugin: (store: Store) => void

  RESTORE_MUTATION: Mutation<S>
}