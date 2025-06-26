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

```shell
npx babel wallpanel-src.js --out-file wallpanel.js
```

# Documentation
```shell
uvx --with mkdocs-material mkdocs serve
```

## my.home-assistant.io
Supported redirect pages: https://my.home-assistant.io/faq/
