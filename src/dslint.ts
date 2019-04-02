import path from 'path';
import {getAllRules} from './utils';
import {getLocalStyles} from './figma/helpers';

export function isParentNode(node: Figma.Mixins.Children) {
  return node.hasOwnProperty('children');
}

export function lint(
  file: Figma.File,
  localStyles: Figma.LocalStyles,
  client: Figma.Client.Client
): DSLint.Rules.Failure[] {
  const rulesPath = path.resolve(__dirname, 'rules');
  const rules = getAllRules([rulesPath]);

  return lintNode(file.document, rules, file, localStyles, client);
}

export function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of rule names, and Rules to apply
  rules: DSLint.Rules.NameAndConstructor[],
  // The original Figma file
  file: Figma.File,
  // A map of the Local Styles for the File
  localStyles: Figma.LocalStyles,
  // The Figma API client
  client: Figma.Client.Client
): DSLint.Rules.Failure[] {
  // Run through all rule's init hook
  const rulesToApply = rules.map(([ruleName, ctor]) => new ctor({ruleName}));
  rulesToApply.forEach(rule => rule.init(client, file));

  let failures: DSLint.Rules.Failure[] = [];

  // Iterate through all rules and apply it to the given node.
  rulesToApply.forEach(rule => {
    failures = failures.concat(rule.apply(node, file, localStyles));
  });

  if (isParentNode(node)) {
    (<Figma.Mixins.Children>node).children.forEach(child => {
      failures = failures.concat(
        lintNode(child, rules, file, localStyles, client)
      );
    });
  }

  return failures;
}
