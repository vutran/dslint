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

```bash
$ FIGMA_TOKEN=my-figma-token dslint abcdefg1234567890
```

## JavaScript API

```tsx
import {dslint, getCoreRulesPath} from 'dslint';

const fileKey = 'abcdefg1234567890';
const token = 'my-figma-token';

const rulesPaths = [
  // optionally include the core set of rules already provided
  getCoreRulesPath(),
  // optionally add more rules directory
  path.resolve(__dirname, './rules'),
];

dslint(fileKey, token, rulesPaths).then(failures => {
  console.log(failures);
});
```

## Writing a Custom Lint Rule

DSLint ships with some basic rules you can apply to your design systems. However, these rules may not account for some of the best practices your team follows. DSLint was written to allow you to extend the system with your own custom rules which can be written in JavaScript. See below for a TypeScript example.

### Requirements

- The exported module should be a class named `Rule`.
- All rules should extend the `AbstractRule` class.
- All rules must implement the `apply()` method that return a list of failures.

```tsx
import {AbstractRule} from 'dslint';

export class Rule extends AbstractRule {
  apply(
    node: Figma.Node,
    file: Figma.File,
    localStyles: Figma.LocalStyles
  ): DSLint.Rules.Failures[] {
    if (node.type === 'COMPONENT') {
      this.addFailure({
        ruleName: this.getRuleName(),
        node,
        message: `Component detected: ${node.name}`,
      });
    }
    return this.getAllFailures();
  }
}
```
