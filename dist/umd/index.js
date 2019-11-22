(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.ErioVuexPersist = {}));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * 使用持久化形式的 pathKeyState 覆盖 Vuex 的根状态对象 rootState 与合并，结果为 Vuex 的根状态对象的形式
   * 根状态对象 rootState 中不存在的属性不会被覆盖
   * @param {Object} rootState Vuex 根状态对象
   * @param {Object} pathKeyState 以属性路径作为键的对象，如 { 'a.b.c': 1, 'a.b.d': 2 }
   */
  var cover = function cover(rootState, pathKeyState) {
    var copiedRootState = JSON.parse(JSON.stringify(rootState));

    for (var path in pathKeyState) {
      var value = pathKeyState[path];
      setNestedItem(copiedRootState, path, value);
    }

    return copiedRootState;
  };
  /**
   * 判断 obj 是否**不为对象**
   * @param {any} obj 任意形式的数据
   */

  var isNotObject = function isNotObject(obj) {
    return obj === null || _typeof(obj) !== 'object';
  };
  /**
   * 通过属性路径 path 在上下文 ctx 中取得对应的值
   * @param {Object} ctx 需要通获取属性值的上下文
   * @param {String} path 属性在上下文 ctx 中的路径，形如 'a.b.c'
   */

  var getNestedItem = function getNestedItem(ctx, path) {
    if (isNotObject(ctx)) {
      return;
    }

    if (typeof path !== 'string') {
      return;
    }

    var keys = path.split('.');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (key in ctx) {
          ctx = ctx[key];
          continue;
        }

        return;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return {
      value: ctx
    };
  };
  /**
   * 在上下文 ctx 中通过路径 path 将对应属性赋值为 value
   * @param {Object} ctx 需要设置属性值的上下文
   * @param {String} path 属性在上下文中的路径，形如 'a.b.c'
   * @param {any} value 需要设置的属性的值
   */

  var setNestedItem = function setNestedItem(ctx, path, value) {
    if (isNotObject(ctx)) {
      return;
    }

    var keys = path.split('.');
    var last = keys.pop();

    if (!last) {
      return;
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var key = _step2.value;

        if (isNotObject(ctx[key])) {
          return;
        }

        ctx = ctx[key];
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    ctx[last] = value;
  };
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

  var ErioVuexPersist = function ErioVuexPersist(options) {
    var _this = this;

    _classCallCheck(this, ErioVuexPersist);

    // 储存使用的容器
    this.storage = options.storage || window.localStorage; // 状态储存规则

    this.rule = options.rule; // 状态在容器中使用的键

    this.storageKey = options.storageKey || 'erio-vuex-persist'; // 严格模式（能获得状态恢复完成的标志）

    this.strict = options.strict; // 状态恢复函数

    this.restoreState = options.restoreState ? options.restoreState : function (key, storage) {
      var value = storage.getItem(key);

      if (typeof value === 'string') {
        return JSON.parse(value || {});
      }

      return value || {};
    }; // 状态储存函数

    this.saveState = options.saveState ? options.saveState : function (key, state, storage) {
      storage.setItem(key, JSON.stringify(state));
    }; // Vuex 使用的插件

    this.plugin = function (store) {
      // 从 storage 中取出数据恢复至 Vuex
      var prevState = _this.restoreState(_this.storageKey, _this.storage);

      if (_this.strict) {
        store.commit('RESTORE_MUTATION', prevState);
      } else {
        store.replaceState(cover(store.state, prevState));
      }

      var miniStore = prevState || {}; // 根据 rule 在每一次 mutation 后将需要的状态同步至 storage

      store.subscribe(function (mutation, state) {
        var type = mutation.type;

        if (!(type in _this.rule)) {
          return;
        }

        var paths = _this.rule[type];
        var tempStore = paths.reduce(function (a, b) {
          var item = getNestedItem(state, b);

          if (item) {
            a[b] = item.value;
          }

          return a;
        }, {});
        miniStore = _objectSpread2({}, miniStore, {}, tempStore);

        _this.saveState(_this.storageKey, miniStore, _this.storage);
      });
    };
    /**
     * from: https://github.com/championswimmer/vuex-persist/blob/master/src/index.ts
     * 通过 Mutation 的形式恢复状态
     * @param {Object} state Vuex 根状态对象
     * @param {Object} savedState 要恢复的局部状态
     */


    this.RESTORE_MUTATION = function (state, savedState) {
      var coverdState = cover(state, savedState || {});

      for (var _i = 0, _Object$keys = Object.keys(coverdState); _i < _Object$keys.length; _i++) {
        var propertyName = _Object$keys[_i];

        _this._vm.$set(state, propertyName, coverdState[propertyName]);
      }
    };
  };

  exports.default = ErioVuexPersist;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
