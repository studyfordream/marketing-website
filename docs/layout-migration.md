## Migrating Layouts

Update `{{> body }}` to `{% body %}`

Any front-matter using `layout:` should specify the layout by the basename only and leave off the extension.

Update `layout: wrapped.hbs` to `layout: wrapped`
