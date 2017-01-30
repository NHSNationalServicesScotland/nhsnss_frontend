/**
 * @name app.js:
 * @version 0.1.0: Fri, 27 Jan 2016 12:15:44 GMT
 * @author neilha
 * @license MIT
 */
 
;(function (global) {
	'use strict'
	var $ = require('jquery');
		
	var NHSNSS = global.NHSNSS || {};
	
	/* 
		Register modules. The name of module must be the camel case 
		of the data-module attribute, e.g. data-module="some-module" 
		becomes SomeModule. The second parameter is the module constructor.
	*/
	NHSNSS.modules = require('./modules.js');
	NHSNSS.modules.add('SomeModule', require('./modules/someModule.js'));
	
	$(document).ready(function(){
		// start modules
		NHSNSS.modules.start();
	});  
  
})(window)



