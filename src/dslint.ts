import {getAllRules} from './utils';
import {Client, getLocalStyles} from './toolkits/figma';

export function lint(
  file: Figma.File,
  rules: DSLint.Rules.AbstractRule[],
  options: DSLint.LintOptions,
  config?: DSLint.Configuration
): DSLint.Rules.Failure[] {
  let failures: DSLint.Rules.Failure[] = [];
  const {localStyles} = options;

  rules.forEach(rule => {
    failures = failures.concat(rule.apply(file, options.localStyles));
  });

  return failures;
}

export async function dslint(
  fileKey: string,
  personalAccessToken: string,
  rulesPaths: string[],
  config: DSLint.Configuration
): Promise<DSLint.Rules.Failure[]> {
  try {
    const rulesCtors = getAllRules(rulesPaths);
    const client = new Client({personalAccessToken});
    const file = (await client.file(fileKey)).body;
    const localStyles = await getLocalStyles(file, client);
    const rules = rulesCtors.map(r => new r());
    return lint(file, rules, {localStyles}, config);
  } catch (err) {
    console.trace(err);
  }
  return [];
}
