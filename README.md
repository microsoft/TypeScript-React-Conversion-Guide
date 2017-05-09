# TypeScript React Conversion Guide

This walkthrough illustrates how to adopt TypeScript in an existing React/Babel/Webpack project. We'll start with a TicTacToe project written fully in JavaScript in the `TicTacToe_JS` folder as an example. By the end, you will have a TicTacToe project fully written with TypeScript.

If you are starting a new React project instead of converting one, you can use [this tutorial](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/tutorials/React.md).

Adopting TypeScript in any project can be broken down into 2 phases,
 * Adding TypeScript compiler (tsc) to your build pipeline.
 * Converting JavaScript files into TypeScript files.

# Understand the existing JavaScript project

Before we dive into TypeScript adoption, let's take a look at the structure of the TicTacToe app. It contains a few components and looks like below with or without TypeScript.

<p align="center">
    <img src ="image/components.png"/>
</p>

As shown in `package.json`, the app already includes React/ReactDOM, Webpack as bundler & task runner, and [babel-loader](https://github.com/babel/babel-loader) Webpack plugin to use Babel for ES6 and JSX transpilation. The project has the below overall layout before we adopt TypeScript:

```
TicTacToe_JS /
    |---- css/			        // css style sheets
    |---- src/			        // source files
        |---- app.jsx		        // the App React component
        |---- board.jsx		        // the TicTacToe Board React component
        |---- constants.js		// some shared constants
        |---- gameStateBar.jsx	        // GameStatusBar React component
        |---- restartBtn.jsx	        // RestartBtn React component
    |---- .babelrc		        // a list of babel presets
    |---- index.html		        // web page for our app
    |---- package.json		        // node package configuration file 
    |---- webpack.config.js	        // Webpack configuration file
```

# Add TypeScript compiler to build pipeline

## Install dependencies

First off, open terminal and `cd` to the `TicTacToe_JS` folder. Install dependencies in `package.json`.

```
cd TicTacToe_JS
npm install
```

Additionally, install TypeScript (2.3 or higher), [awesome-typescript-loader](https://www.npmjs.com/package/awesome-typescript-loader) and [source-map-loader](https://www.npmjs.com/package/source-map-loader) as dev dependencies if you haven't. awesome-typescript-loader is a Webpack plugin that helps you compile TypeScript code to JavaScript, much like babel-loader for Babel. There are also other alternative loaders for TypeScript, such as [ts-loader](https://github.com/TypeStrong/ts-loader). source-map-loader adds source map support for debugging.

```
npm install --save-dev typescript awesome-typescript-loader source-map-loader
```

Get the type declaration files (.d.ts files) from [@types](https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/) for any library in use. For this project, we have React and ReactDOM. 

```
npm install --save @types/react @types/react-dom
```

If you are using an older version of React/ReacDOM that are incompatible with the latest .d.ts files from @types, you can specify version number for `@types/react` and `@types/react-dom` in `package.json`.

## Configure TypeScript

Next, configure TypeScript by creating a `tsconfig.json` file in the `TicTacToe_JS` folder, and add, 

```
{
    "compilerOptions": {
        "outDir": "./dist/",        // path to output directory
        "sourceMap": true,          // allow sourcemap support
        "strictNullChecks": true,   // enable strict null checks as a best practice
        "module": "es6",            // specifiy module code generation
        "jsx": "react",             // use typescript to transpile jsx to js
        "target": "es5",            // specify ECMAScript target version
        "allowJs": true             // allow a partial TypeScript and JavaScript codebase  
    },
    "include": [
        "./src/"
    ]
}
```

You can edit some of the options or add more based on your own need. See more full [compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

## Set up build pipeline

To add TypeScript compilation as part of our build process, you need to modify the Webpack config file `webpack.configure.js`. This section is specific to Webpack. However, if you are using a different task runner (e.g. Gulp) for your React/Babel project, the idea is the same - replace the Babel build step with TypeScript, as TypeScript also offers transpiling to lower ECMAScript versions and JSX transpilation with a shorter build time in most cases. If you wish, you can also keep Babel by adding a TypeScript build step before Babel and feeding its output to Babel. 

Generally, we need to change `webpack.config.js` in a few ways,

1. Expand the module resolution extensions to include `.ts` and `.tsx` files.
2. Replace `babel-loader` with `awesome-typescript-loader`. 
3. Add source-map support.

Let's modify `webpack.configure.js` as below,

```js
module.exports = {
  // change to .tsx if necessary
  entry: './src/app.jsx',
  output: {
    filename: './dist/bundle.js'
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
      { test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader' } },
      // addition - add source-map support 
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  // addition - add source-map support
  devtool: "source-map"
}
```

You can delete `.babelrc` and all Babel dependencies from `package.json` if you no longer need them.

Note that if you plan to adopt TypeScript in the entry file, you should change `entry: './src/app.jsx',` to `entry: './src/app.tsx',` as well. For the time being, we will keep it as `app.jsx`.

You now have the build pipeline correctly set up with TypeScript handling the transpilation. Try bundling the app with the following command and then open `index.html` in a browser,

```
node ./node_modules/webpack/bin/webpack.js
```

# Transition from JS(X) to TS(X)

In this part, we will walk through the following steps progressively,

1. The minimum steps of converting one module to TypeScript.
2. Adding types in one module to get richer type checking.
3. Fully adopting TypeScript in the entire codebase.

While you get the most out of TypeScript by fully adopting it across your codebase, understanding each of the three steps comes in handy as you decide what to do in case you have certain part of your JavaScript codebase you want to leave as-is (think legacy code that no one understands).

## Minimum transition steps

Let's look at `gameStateBar.jsx` as an example.

Step one is to rename `gameStateBar.jsx` to `gameStateBar.tsx`. If you are using any editor with TypeScript support such as [Visual Studio Code](https://code.visualstudio.com/), you should be able to see a few complaints from your editor.

On line 1 `import React from "react";`, change the import statement to `import * as React from "react"`. This is because while importing a CommonJS module, Babel assumes `modules.export` as default export, while TypeScript does not.

On line 3 `export class GameStateBar extends React.Component {`, change the class declaration to `export class GameStateBar extends React.Component<any, any> {`. The type declaration of `React.Component` uses [generic types](https://www.typescriptlang.org/docs/handbook/generics.html) and requires providing the types for the property and state object for the component. The use of `any` allows us to pass in any value as the property or state object, which is not useful in terms of type checking but suffices as minimum effort to appease the compiler.

By now, awesome-typescript-loader should be able to successfully compile this TypeScript component to JavaScript. Again, try bundling the app with the following command and then open `index.html` in a browser,

```
node ./node_modules/webpack/bin/webpack.js
```

## Add types

The more type information provided to TypeScript, the more powerful its type checking is. As a best practice, we recommend providing types for all declarations. We will again use the `gameStateBar` component as an example.

For any `React.Component`, we should properly define the types of the property and state object. The `gameStateBar` component has no properties, therefore we can use `{}` as type. 

The state object contains only one property `gameState` which shows the game status (either nothing, someone wins, or draw). Given `gameState` can only have certain known string literal values, let's use [string literal type](https://www.typescriptlang.org/docs/handbook/advanced-types.html) and define the interface as follow before the class declaration.

```ts
interface GameStateBarState {
    gameState: "" | "X Wins!" | "O Wins!" | "Draw";    
}
```

With the defined interface, change the `GameStateBar` class declaration,

```ts
export class GameStateBar extends React.Component<{}, GameStateBarState> {...}
```

Now, supply type information for its members. Note that providing types to all declarations is not required, but recommended for better type coverage.

```ts
// add types for params
constructor(props: {}) {...}
handleGameStateChange(e: CustomEvent) {...}
handleRestart(e: Event) {...}

// add types in arrow functions
componentDidMount() {
    window.addEventListener("gameStateChange", (e: CustomEvent) => this.handleGameStateChange(e));
    window.addEventListener("restart", (e: CustomEvent) => this.handleRestart(e));
}

// add types in arrow functions
componentWillUnmount() {
    window.removeEventListener("gameStateChange", (e: CustomEvent) => this.handleGameStateChange(e));
    window.removeEventListener("restart", (e: CustomEvent) => this.handleRestart(e));
}
```

To use stricter type checking, you can also specify useful [compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) in `tsconfig.json`. For example, `noImplicitAny` is a recommended option that triggers the compiler to error on expressions and declarations with an implied `any` type.

You can also add [private/protected modifier](https://www.typescriptlang.org/docs/handbook/classes.html) to class members for access control. Let's mark `handleGameStateChange` and `handleRestart` as `private` as they are internal to `gameStateBar`.

```ts
private handleGameStateChange(e: CustomEvent) {...}
private handleRestart(e: Event) {...}
```

Again, try bundling the app with the following command and then open `index.html` in a browser,

```
node ./node_modules/webpack/bin/webpack.js
```

## Adopt TypeScript in the entire codebase

Adopting TypeScript in the entire codebase is more or less repeating the previous two steps for all js(x) files. You may need to make changes additional to what is mentioned above while converting perfectly valid JavaScript to TypeScript. However the TypeScript compiler and your editor (if it has TypeScript support) should give you useful tips and error messages. For instance, parameters can be optional in JavaScript, but in TypeScript all [optional parameter](https://www.typescriptlang.org/docs/handbook/functions.html) must be marked with `?`

You can see the fully converted TicTacToe project in the `TicTacToe_TS` folder. Build the app with,

```
npm install
node ./node_modules/webpack/bin/webpack.js
```

Run the app by openning `index.html`.
