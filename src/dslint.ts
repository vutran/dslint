import path from 'path';
import {getAllRules} from './utils';
import {getLocalStyles} from './figma/helpers';

export function isParentNode(node: Figma.Mixins.Children) {
  return node.hasOwnProperty('children');
}

export function lint({
  client,
  file,
  localStyles,
}: DSLint.LintOptions): DSLint.Rules.Failure[] {
  const rulesPath = path.resolve(__dirname, 'rules');
  const rules = getAllRules([rulesPath]);

  return lintNode(file.document, rules, {client, file, localStyles});
}

export function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of rule names, and Rules to apply
  rules: DSLint.Rules.NameAndConstructor[],
  // A set of linter options
  options: DSLint.LintOptions
): DSLint.Rules.Failure[] {
  const {client, file, localStyles} = options;
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
      failures = failures.concat(lintNode(child, rules, options));
    });
  }

  return failures;
}
