export function isParentNode(node: Figma.Mixins.Children) {
  return !!node.children;
}

export function lint(
  file: Figma.File,
  rules: DSLint.Rules.NameAndConstructor[],
  client: Figma.Client.Client
) {
  const rulesToApply = rules.map(([ruleName, ctor]) => new ctor({ruleName}));

  // Run through all rule's init hook
  rulesToApply.forEach(rule => rule.init(client, file));

  return lintNode(file.document, rulesToApply, file);
}

export function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of rules to apply
  rules: DSLint.Rules.AbstractRule[],
  // The original Figma file
  file: Figma.File
) {
  let failures: DSLint.Rules.Failure[] = [];

  // Iterate through all rules and apply it to the given node.
  rules.forEach(async rule => {
    failures = failures.concat(rule.apply(node, file));
  });

  if (isParentNode(node)) {
    (<Figma.Mixins.Children>node).children.forEach(async child => {
      failures = failures.concat(lintNode(child, rules, file));
    });
  }

  return failures;
}
