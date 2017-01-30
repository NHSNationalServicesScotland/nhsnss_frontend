/**
 * @name someModule.js:
 * @version 0.1.0: Fri, 27 Jan 2016 12:15:44 GMT
 * @author neilha
 * @license MIT
 */
(function (root, factory) {
	if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
	
	// constructor
	var SomeModule = function() {}
	
	SomeModule.prototype.start = function(){
		return 'someModule started';
	}
	
    // expose constructor
    return SomeModule;
}));