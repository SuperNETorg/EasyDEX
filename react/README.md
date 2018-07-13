EDEX ReactJS
---

Setup
---

Node version 6 or 7 is required.

```
npm install
```


Usage
---

## Running in dev mode

`npm start`

Opens Application in browser [http://localhost:3000/]


## Build (production)

Build will be placed in the `build` folder.

```
 npm run build
```

## Running in preview production mode

This command will start webpack dev server, but with `NODE_ENV` set to `production`.
Everything will be minified and served.
Hot reload will not work, so you need to refresh the page manually after changing the code.

```
npm run preview
```

## Linting

```
$ npm run lint
