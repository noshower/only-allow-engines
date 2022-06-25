# only-allow-engines

Force a specific package manager and node version to be used on a project

## Usage 1

### 1. Install

```
npm i only-allow-engines --save
```

### 2. Config engines

Add the engines field to your package.json, like this:

```
 "engines": {
    "node": ">=16",
    "npm": ">8"
  }
```

if you want to force pnpm, like this:

```
"engines": {
    "node": ">=16",
    "pnpm": ">6"
  }
```

you can read more about engines [in the npm docs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)

### 3. Add script to your package.json

```
{
  "scripts": {
    "preinstall": "npx only-allow-engines"
  }
}
```

## Usage 2

```
const onlyAllowEngines = require('only-allow-engines');

onlyAllowEngines({
  pnpm: ">=6",
  node: ">=16.0.0",
})
```
