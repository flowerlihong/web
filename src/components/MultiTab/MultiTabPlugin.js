import { EventBus } from '../../event-bus'

const MultiTabPlugin = {}

MultiTabPlugin.install = function (Vue, options) {
  Vue.prototype.$multiTab = function (fullPath) {
    EventBus.$emit('openMultiTab', fullPath)
  }
}

export default MultiTabPlugin
