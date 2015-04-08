## Migrating Helpers

### Assemble 0.4.x Helpers

```js
module.exports.register = function (Handlebars) {
  Handlebars.registerHelper('foo', function () {
    return 'bar';
  });
};
```

### Assemble 0.6.0 Helpers

```js
// foo.js
module.exports = function foo () {
  return 'bar';
};

// assemblefile.js
var foo = require('./helpers/foo.js');
var assemble = require('assemble');
assemble.helper('foo', foo);

// or
// requires filenames to match desired helper names
assemble.helpers(['helpers/*.js']);
```
