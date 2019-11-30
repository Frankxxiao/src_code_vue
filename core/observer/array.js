/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
//先克隆一份数组原型
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    //执行原始方法
    const result = original.apply(this, args)
    //额外通知变更，当然，只有这7个方法才会有这个待遇
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    //对新加入对象进行响应化处理
    if (inserted) ob.observeArray(inserted)
    // notify change
    //此处通知，可以知道数组更新行为
    ob.dep.notify()
    return result
  })
})
