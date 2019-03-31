import path from 'path';
import {PRIVATE_MARKER} from './constants';

export function isParentNode(node: Figma.ParentNode) {
  return !!node.children;
}

export async function lint(
  file: Figma.File,
  rules: DSLint.Rules.NameAndConstructor[]
) {
  const rulesToApply = rules.map(([ruleName, ctor]) => new ctor({ruleName}));

  return await lintNode(file.document, rulesToApply, file);
}

export async function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of rules to apply
  rules: DSLint.Rules.AbstractRule[],
  // The original Figma file
  file: Figma.File
): Promise<DSLint.Rules.Failure[]> {
  const allFailures: DSLint.Rules.Failure[] = [];

  // Iterate through all rules and apply it to the given node.
  rules.forEach(async rule => {
    // Ignore `@private` nodes
    if (!node.name.includes(PRIVATE_MARKER)) {
      const ruleFailures = await rule.apply(node, file);
      ruleFailures.forEach(failure => {
        allFailures.push(failure);
      });
    }
  });

  if (isParentNode(node)) {
    (<Figma.ParentNode>node).children.forEach(async child => {
      const childFailures = await lintNode(child, rules, file);
      childFailures.forEach(failure => {
        allFailures.push(failure);
      });
    });
  }

  return allFailures;
}
