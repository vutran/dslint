# DSLint

> DSLint is an extensible linting tool for designers. Similar to code linting, design linting can be used to find problematic patterns in your design files.

## Install

If you'd like to use the CLI version, you can instally it globally:

```bash
$ npm i -g dslint
```

If you'd like to use the JavaScript API for your own applications, you can install it as a dependency:

```bash
$ npm i -S dslint
```

## CLI Usage

### Environmental Variables

- `FIGMA_TOKEN` - A personal access token from Figma API

Basic usage:

```bash

$ dslint abcdefg1234567890
```

Lint against a specific node and it's children

```bash
$ dslint abcdefg1234567890 --matchName "Foo"
```

## JavaScript API

```ts
import {dslint, getCoreRulesPath} from 'dslint';

const fileKey = 'abcdefg1234567890';
const token = 'my-figma-token';

const rulesPaths = [
  // optionally include the core set of rules already provided
  getCoreRulesPath(),
  // optionally add more rules directory
  path.resolve(__dirname, './rules'),
];

// Optional configuration
const config = {
  // lints against a specific node and it's children
  matchName: 'Foo',
};

dslint(fileKey, token, rulesPaths, config).then(failures => {
  console.log(failures);
});
```

## Writing a Custom Lint Rule

DSLint ships with some basic rules you can apply to your design systems. However, these rules may not account for some of the best practices your team follows. DSLint was written to allow you to extend the system with your own custom rules which can be written in JavaScript. See below for a TypeScript example.

### Requirements

- The exported module should be a class named `Rule`.
- All rules should extend the `AbstractRule` class.
- All rules must implement the `apply()` method that return a list of failures.

```ts
import {AbstractRule} from 'dslint';

/**
 * Simple rule that detects for component nodes.
 */
export class Rule extends AbstractRule {
  apply(
    node: Figma.Node,
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failures[] {
    if (node.type === 'COMPONENT') {
      return [
        {
          node,
          message: `Component detected: ${node.name}`,
        },
      ];
    }
    return [];
  }
}
```
