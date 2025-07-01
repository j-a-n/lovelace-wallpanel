# Linting

```shell
# Install packages
npm install

# Run linter
npx eslint wallpanel-src.js

# Automatically fix problems
npx eslint --fix wallpanel-src.js
```

# Babel
Set `browserslist` in `package.json`.
See https://browsersl.ist/

# Build
Generate a Babel-processed wallpanel.js with fetch and Promise polyfills included.
```shell
npm run build
```

# Documentation
```shell
uvx --with mkdocs-material mkdocs serve
```

## my.home-assistant.io
Supported redirect pages: https://my.home-assistant.io/faq/
