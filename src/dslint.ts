import {getAllRules} from './utils';
import {Client} from './toolkits/figma';

export function lint(
  file: Figma.File,
  rules: DSLint.Rules.AbstractRule[],
  config?: DSLint.Configuration
): DSLint.Rules.Failure[] {
  let failures: DSLint.Rules.Failure[] = [];

  rules.forEach(rule => {
    failures = failures.concat(rule.apply(file, config));
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
    const client = new Client({personalAccessToken});
    const file = (await client.file(fileKey)).body;
    const rulesCtors = getAllRules(rulesPaths, config, {client, file});
    const rules = await Promise.all(
      rulesCtors.map(async r => {
        const ruleInstance = new r();
        if (typeof ruleInstance.ruleDidLoad === 'function') {
          await ruleInstance.ruleDidLoad(file, client, config);
        }
        return ruleInstance;
      })
    );
    return lint(file, rules, config);
  } catch (err) {
    console.trace(err);
  }
  return [];
}
