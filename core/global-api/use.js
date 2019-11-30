/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    //插件本身作为第一个参数，需要排除
    const args = toArray(arguments, 1)
    //将vue的构造函数作为第一个参数
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      //如果插件plugin本身就是函数，可以不需要install，直接将自己作为install
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
