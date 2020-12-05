const JasmneCore = require('jasmine-core')
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmneCore
}
require('jasmine-ajax')
