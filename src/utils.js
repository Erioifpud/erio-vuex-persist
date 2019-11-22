/**
 * 使用持久化形式的 pathKeyState 覆盖 Vuex 的根状态对象 rootState 与合并，结果为 Vuex 的根状态对象的形式
 * 根状态对象 rootState 中不存在的属性不会被覆盖
 * @param {Object} rootState Vuex 根状态对象
 * @param {Object} pathKeyState 以属性路径作为键的对象，如 { 'a.b.c': 1, 'a.b.d': 2 }
 */
export const cover = (rootState, pathKeyState) => {
  const copiedRootState = JSON.parse(JSON.stringify(rootState))
  for (const path in pathKeyState) {
    const value = pathKeyState[path]
    setNestedItem(copiedRootState, path, value)
  }
  return copiedRootState
}

/**
 * 判断 obj 是否**不为对象**
 * @param {any} obj 任意形式的数据
 */
export const isNotObject = (obj) => obj === null || typeof obj !== 'object'

/**
 * 通过属性路径 path 在上下文 ctx 中取得对应的值
 * @param {Object} ctx 需要通获取属性值的上下文
 * @param {String} path 属性在上下文 ctx 中的路径，形如 'a.b.c'
 */
export const getNestedItem = (ctx, path) => {
  if (isNotObject(ctx)) {
    return
  }
  if (typeof path !== 'string') {
    return
  }
  const keys = path.split('.')
  for (const key of keys) {
    if (key in ctx) {
      ctx = ctx[key]
      continue
    }
    return
  }
  return {
    value: ctx
  }
}

/**
 * 在上下文 ctx 中通过路径 path 将对应属性赋值为 value
 * @param {Object} ctx 需要设置属性值的上下文
 * @param {String} path 属性在上下文中的路径，形如 'a.b.c'
 * @param {any} value 需要设置的属性的值
 */
export const setNestedItem = (ctx, path, value) => {
  if (isNotObject(ctx)) {
    return
  }
  const keys = path.split('.')
  const last = keys.pop()
  if (!last) {
    return
  }
  for (const key of keys) {
    if (isNotObject(ctx[key])) {
      return
    }
    ctx = ctx[key]
  }
  ctx[last] = value
}

/**
 * [已弃用] 将持久化形式的 pathKeyState 转换为 Vuex 的根状态对象形式
 * @param {Object} pathKeyState 以属性路径作为键的对象，如 { 'a.b.c': 1, 'a.b.d': 2 }
 */
// export const toState = (pathKeyState) => {
//   if (isNotObject(pathKeyState)) {
//     return
//   }
//   let state = {}
//   for (let path in pathKeyState) {
//     const value = pathKeyState[path]
//     const keys = path.split('.')
//     const last = keys.pop()
//     let pointer = state
//     for (const key of keys) {
//       if (!pointer[key]) {
//         pointer[key] = {}
//       }
//       pointer = pointer[key]
//     }
//     pointer[last] = value
//   }
//   return state
// }
