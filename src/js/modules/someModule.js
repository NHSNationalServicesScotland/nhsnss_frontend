/**
 * @name someModule.js: an example module which alerts that the module has been started.
 * @version 0.1.0: Fri, 27 Jan 2016 12:15:44 GMT
 * @author neilha
 * @license MIT
 */
;(function(global) {
  'use strict'
  var $ = global.jQuery;
  
  var NHSNSS = global.NHSNSS || {}
  NHSNSS.Modules = NHSNSS.Modules || {}
  
  NHSNSS.Modules.SomeModule = function() {
    this.start = function(element) {
      // module code, start with event listeners
	  alert('someModule started');
    }
  }
})(window)