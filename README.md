![mx-file-router logo](https://i.imgur.com/J2tmcZp.png)

  Fast, light-weight file based routing solution for [Node.js](http://nodejs.org).

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

---
## Version notices

> **v1.2.0beta**
> \+ Added support for CJS files`(lightly tested, might not work as expected)`
>
> **v1.1.0beta**
> \+ /routes subfolder support`(not tested, might not work as expected)`
---

## Usage

```js
const express = require('express')
const Router = require('mx-file-router')
const app = express()

Router(app, 3000)
// Port will default to 3000.
```

### Example methods

| Method | File |
| ------ | ------ |
| GET | home.get.js |
| HEAD | home.head.js |
| POST | home.post.js |
| PUT | home.put.js |
| DELETE | home.delete.js |
| CONNECT | home.connect.js |
| OPTIONS | home.options.js |
| TRACE | home.trace.js |
| PATCH | home.patch.js |

To create a route, first create a folder in the project root named `routes`.
After that, you can create `js` or `ts` files like the examples above.

Write the following code inside the newly created route file:
```js
// An array of routes that will lead to this route file.
export const routes = ['/']

// The response of this route file.
export default async (req, res) => {
    res.status(200).send('<h1>Homepage</h1>')
}
```

## Installation

Before installing, you will have to [download and install Node.js](https://nodejs.org/en/download/).
Node.js v10.0 or higher is required.

If this is a new project, you will have to create a `package.json`.
This can easily be done with the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

**Installing the package**

```console
$ npm install mx-file-router
$ npm update
```

**Dependencies**
[Express](https://www.npmjs.com/package/express) will be automatically installed as a dependency.

More information on installing npm packages can be found [here](https://docs.npmjs.com/getting-started/installing-npm-packages-locally).

## Features

  * Low-code setup
  * Easy to use
  * Low file size


## License

  [GPL 3.0](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/mx-file-router
[npm-downloads-url]: https://npmcharts.com/compare/mx-file-router?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/mx-file-router
[npm-install-size-url]: https://packagephobia.com/result?p=mx-file-router
[npm-url]: https://npmjs.org/package/mx-file-router
[npm-version-image]: https://badgen.net/npm/v/mx-file-router