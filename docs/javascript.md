## JavaScript
Running the build.cmd file concatenates and minifies all javascript modules into a single app.js file which is saved in the /dist folder.
The app.js file has a dependency on jQuery and should therefore be included in your markup after jQuery.

```html
<script src="/dist/js/vendor/jquery.min.js"></script>
<script src="/dist/js/app.min.js"></script>
```

## Modules

The toolkit comes with a module pattern that makes it easy to write re-usable modular components, without having to worry about where and when the module should be instantiated.
The pattern and accompanying documentation was adapted from GOV.UK code available on [github](https://github.com/alphagov/govuk_frontend_toolkit) and released under the MIT licence.

### Usage

Javascript modules can be specified in markup using `data-` attributes:

```html
<div data-module="some-module">
  <strong>Some other markup inside the module</strong>
</div>
```

Modules can be found and started by including `govuk/modules.js` and running:

```javascript
$(document).ready(function(){
	NHSNSS.modules.start();
}); 
```

This will attempt to find and start all modules in the page. For the example above it will look for a module at `NHSNSS.Modules.SomeModule`. Note the value of the data attribute has been converted to _PascalCase_.

The module will be instantiated and then its `start` method called. The HTML element with the `data-module` attribute is passed as the first argument to the module. This limits modules to acting only within their containing elements.

```javascript
module = new NHSNSS.Modules[type]()
module.start(element)
```

Running `NHSNSS.modules.start()` multiple times will have no additional affect. When a module is started a flag is set on the element using the data attribute `module-started`. `data-module-started` is a reserved attribute. It can however be called with an element as the first argument, to allow modules to be started in dynamically loaded content:

```javascript
var $container = $('.dynamic-content')
NHSNSS.modules.start($container)
```

### Module structure

A module must add its constructor to `NHSNSS.Modules` and it must have a `start` method.
The simplest module looks like:

```javascript
;(function(global) {
  'use strict'

  NHSNSS.Modules.SomeModule = function() {
    this.start = function(element) {
      // module code
    }
  }
})(window)
```

A module must be placed in a single file named the same as the module, e.g. someModule.js. The file must be saved in the /modules folder.

### Writing modules

Whilst this isn’t prescriptive, it helps if modules look and behave in a similar manner.

#### Use `js-` prefixed classes for interaction hooks

Make it clear where a javascript module will be applying behaviour:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">Toggle</a>
  <div class="js-toggle-target">Target</div>
</div>
```

#### Declare event listeners at the start

Beginning with a set of event listeners clearly indicates the module’s intentions.

```js
this.start = function(element) {
  element.on('click', '.js-toggle', toggle)
  element.on('click', '.js-cancel', cancel)
}
```

Where possible, assign listeners to the module element to minimise the number of listeners and to allow for flexible markup:

```html
<div data-module="toggle-thing">
  <a href="/" class="js-toggle">This toggles</a>
  <div class="js-toggle-target">
    <p>Some content</p>
    <a href="/" class="js-toggle">This also toggles</a>
  </div>
</div>
```

#### Use data-attributes for configuration

Keep modules flexible by moving configuration to data attributes on the module’s element:

```html
<div
  data-module="html-stream"
  data-url="/some/endpoint"
  data-refresh-ms="5000">
  <!-- updates with content from end point -->
</div>
```