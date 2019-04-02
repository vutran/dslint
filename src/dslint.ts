import path from 'path';
import {PRIVATE_MARKER} from './constants';

export function isParentNode(node: Figma.Mixins.Children) {
  return !!node.children;
}

export async function lint(
  file: Figma.File,
  rules: DSLint.Rules.NameAndConstructor[]
) {
  const rulesToApply = rules.map(([ruleName, ctor]) => new ctor({ruleName}));

  await lintNode(file.document, rulesToApply, file);

  return rulesToApply.reduce(
    (acc, rule) => acc.concat(rule.getAllFailures()),
    []
  );
}

export async function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of rules to apply
  rules: DSLint.Rules.AbstractRule[],
  // The original Figma file
  file: Figma.File
) {
  // Iterate through all rules and apply it to the given node.
  rules.forEach(async rule => {
    // Ignore `@private` nodes
    if (!node.name.includes(PRIVATE_MARKER)) {
      await rule.apply(node, file);
    }
  });

  if (isParentNode(node)) {
    (<Figma.Mixins.Children>node).children.forEach(async child => {
      await lintNode(child, rules, file);
    });
  }
}
