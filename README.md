# erio-vuex-persist

另一个 Vuex Storage 同步插件。

参考了 [vuex-persist](https://github.com/championswimmer/vuex-persist)

# 特性
- 在 mutation 时自动储存状态
- 在初始化时会从 storage 中获取数据去恢复状态
- 支持 Vuex 模块
- 能选择需要同步的状态，不需要以模块为单位去进行
- 可以自定义 storage 与相关存取操作

# 安装
```
yarn add erio-vuex-persist
```

或者

```
npm i erio-vuex-persist
```

# 使用方法
```javascript
import ErioVuexPersist from 'erio-vuex-persist'

const erioVuexPersist = new ErioVuexPersist({
  // 对 value3 与 mod 中的 value1 进行同步
  rule: {
    'increaseMod': [
      'mod.value1'
    ],
    'increaseAll': [
      'mod.value1',
      'value3'
    ]
  }
})

const store = new Vuex.Store({
  state: {
    mod: {
      value1: 0,
      value2: 0
    },
    value3: 0
  },
  mutations: {
    increaseMod (state) {
      state.mod.value1 += 1
      state.mod.value2 += 1
    },
    increaseAll (state) {
      state.mod.value1 += 1
      state.mod.value2 += 1
      state.value3 += 1
    },
    RESTORE_MUTATION: erioVuexPersist.RESTORE_MUTATION
  },
  plugins: [erioVuexPersist.plugin]
})
```

# 配置项
| 属性         | 类型     | 说明                                                 |
|--------------|----------|-----------------------------------------------------|
| storage      | Storage  | 自定义容器实例，<br>_**默认为：window.localStorage**_ |
| storageKey   | String   | 状态储存在容器中的键名，<br>_**默认为：erio-vuex-persist**_ |
| rule         | Rule     | 状态同步规则                                         |
| strict       | Boolean  | 严格模式，此模式必须声明 RESTORE_MUTATION，可通过订阅该 mutation 得到状态恢复完成的通知 |
| restoreState | Function<br>(key, storage) => any | 自定义从容器中恢复数据的操作                           |
| saveState    | Function<br>(key, storage, value) => void | 自定义将状态同步至容器的操作                           |

## 关于 Rule
通过 Vuex 中的 subscribe 能订阅执行 mutation 后的操作，因此每一次的同步都是以 mutation 作为触发条件的。

与其他同类型插件不一样的是，本插件并不以模块为单位去同步，而是细化到模块中的状态，由于在 subscribe 中并不能得知某个 mutation 会影响到具体哪些状态，所以需要在 Rule 中定义两个部分：
1. 作为触发条件的 **Mutation 类型**
2. 该 Mutation 会影响到的具体状态（在 state 中的路径，如 `[module].[value]`）

Rule 格式形如：
```javascript
{
  'Mutation 类型 1': [
    '状态路径 1',
    '状态路径 2'
  ],
  'Mutation 类型 2': [
    '状态路径 1'
  ]
}
```