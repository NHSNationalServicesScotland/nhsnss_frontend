/**
 * @name modules.js: Uses data attributes to instantiate modular components.
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
	
	var _modules = {};
	
	function add(name, module){
		_modules[name] = module;
	}
    // methods
	function find(container){
		container = container || $('body');

		var modules;
		var moduleSelector = '[data-module]';

		modules = container.find(moduleSelector);

		// Container could be a module too
		if (container.is(moduleSelector)) {
			modules = modules.add(container);
		}

		return modules;	
	}

	// eg selectable-table to SelectableTable
	function camelCaseAndCapitalise (string) {
		return capitaliseFirstLetter(camelCase(string));
	}

	// http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
	function camelCase (string) {
		return string.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
	});
	}

	// http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
	function capitaliseFirstLetter (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function start(container){	
		var modules = find(container);

		for (var i = 0, l = modules.length; i < l; i++) {
			var module;
			var element = $(modules[i]);
			var type = camelCaseAndCapitalise(element.data('module'));
			var started = element.data('module-started');
			
			if (typeof _modules[type] === 'function' && !started) {
				module = new _modules[type]();
				module.start(element);
				element.data('module-started', true);
			}				
		}
	}

    // exposed public methods
    return {
        start: start,
		add: add
    }
}));