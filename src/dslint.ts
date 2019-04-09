import path from 'path';
import {getAllRules} from './utils';
import {Client} from './figma';
import {getLocalStyles} from './figma/helpers';

function isParentNode(node: Figma.Mixins.Children) {
  return node.hasOwnProperty('children');
}

function lint({
  client,
  file,
  localStyles,
}: DSLint.LintOptions): DSLint.Rules.Failure[] {
  const rulesPath = path.join(__dirname, 'rules');
  const rules = getAllRules([rulesPath]);
  return lintNode(file.document, rules, {client, file, localStyles});
}

function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // A set of rule names, and Rules to apply
  rules: DSLint.Rules.NameAndConstructor[],
  // A set of linter options
  options: DSLint.LintOptions
): DSLint.Rules.Failure[] {
  const {client, file, localStyles} = options;
  const rulesToApply = rules.map(([ruleName, ctor]) => new ctor({ruleName}));
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

export async function dslint(
  fileKey: string,
  personalAccessToken: string
): Promise<DSLint.Rules.Failure[]> {
  try {
    const client = new Client({personalAccessToken});
    const file = (await client.file(fileKey)).body;
    const localStyles = await getLocalStyles(file, client);
    const allFailures = lint({client, file, localStyles});
    return allFailures;
  } catch (err) {
    console.trace(err);
  }
  return [];
}
