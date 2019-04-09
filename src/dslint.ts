import {getAllRules} from './utils';
import {Client, getLocalStyles} from './toolkits/figma';

function isParentNode(node: Figma.Mixins.Children) {
  return node.hasOwnProperty('children');
}

function lint({
  client,
  file,
  localStyles,
  rules,
}: DSLint.LintOptions): DSLint.Rules.Failure[] {
  return lintNode(file.document, {client, file, localStyles, rules});
}

function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of linter options
  options: DSLint.LintOptions
): DSLint.Rules.Failure[] {
  const {file, localStyles, rules} = options;
  const rulesToApply = rules.map(([ruleName, ctor]) => new ctor({ruleName}));
  let failures: DSLint.Rules.Failure[] = [];

  // Iterate through all rules and apply it to the given node.
  rulesToApply.forEach(rule => {
    failures = failures.concat(rule.apply(node, file, localStyles));
  });

  if (isParentNode(node)) {
    (<Figma.Mixins.Children>node).children.forEach(child => {
      failures = failures.concat(lintNode(child, options));
    });
  }

  return failures;
}

export async function dslint(
  fileKey: string,
  personalAccessToken: string,
  // A list of paths to load rules from
  rulesPaths: string[]
): Promise<DSLint.Rules.Failure[]> {
  try {
    const rules = getAllRules(rulesPaths);
    const client = new Client({personalAccessToken});
    const file = (await client.file(fileKey)).body;
    const localStyles = await getLocalStyles(file, client);
    const allFailures = lint({client, file, localStyles, rules});
    return allFailures;
  } catch (err) {
    console.trace(err);
  }
  return [];
}
