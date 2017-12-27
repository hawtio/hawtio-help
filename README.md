# DEPRECATED

**This project has been moved to [hawtio-core](https://github.com/hawtio/hawtio-core)**
# hawtio-help

This plugin provides help documentation for hawtio by enabling other plugins to register their associated help documentation.

## Installation

```
yarn add @hawtio/help
```

## Set up development environment

### Clone the repository

```
git clone https://github.com/hawtio/hawtio-help
cd hawtio-help
```

### Install development tools

* [Node.js](http://nodejs.org)
* [Yarn](https://yarnpkg.com)
* [gulp](http://gulpjs.com/)

### Install project dependencies

```
yarn install
```

### Run the demo web application

```
yarn start
```

### Change the default proxy port

To proxy to a local JVM running on a different port than `8282` specify the `--port` CLI argument:
```
yarn start -- --port=8181
```
### Turn on source maps generation for debugging TypeScript

If you want to debug `.ts` using a browser developer tool such as Chrome DevTools, pass the `--sourcemap` flag:
```
yarn start -- --sourcemap
```

Do not use this flag when you are committing the compiled `.js` file, as it embeds source maps to the output file. Use this flag only during development.
