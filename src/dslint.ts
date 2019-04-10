import {getAllRules} from './utils';
import {Client, getLocalStyles} from './toolkits/figma';
import {DocumentWalker} from './base/walker';

function isParentNode(node: Figma.Mixins.Children) {
  return node.hasOwnProperty('children');
}

function lint(options: DSLint.LintOptions): DSLint.Rules.Failure[] {
  const rulesToApply = options.rules.map(
    ([ruleName, ctor]) => new ctor({ruleName})
  );
  return lintNode(options.file.document, rulesToApply, options);
}

function lintNode<T extends Figma.Node>(
  // The node to lint
  node: T,
  // Set of rules to apply
  rules: DSLint.Rules.AbstractRule[],
  // A set of linter options
  options: DSLint.LintOptions
): DSLint.Rules.Failure[] {
  const {file, localStyles} = options;
  let failures: DSLint.Rules.Failure[] = [];

  const walker = new DocumentWalker(node, {rules, file, localStyles});
  walker.walk(node);
  return walker.getAllFailures();

  //// Iterate through all rules and apply it to the given node.
  //rules.forEach(rule => {
  //failures = failures.concat(rule.apply(node, file, localStyles));
  //});

  //if (isParentNode(node)) {
  //(<Figma.Mixins.Children>node).children.forEach(child => {
  //failures = failures.concat(lintNode(child, rules, options));
  //});
  //}

  //return failures;
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
    return lint({client, file, localStyles, rules});
  } catch (err) {
    console.trace(err);
  }
  return [];
}
