import {getAllRules} from './utils';
import {Client, getLocalStyles} from './toolkits/figma';
import {DocumentWalker} from './base/walker';

export function lint(
  file: Figma.File,
  rules: DSLint.Rules.AbstractRule[],
  options: DSLint.LintOptions,
  config?: DSLint.Configuration
): DSLint.Rules.Failure[] {
  const {localStyles} = options;

  const walker = new DocumentWalker(
    file.document,
    {rules, file, localStyles},
    config
  );
  walker.walk(file.document);
  return walker.getAllFailures();
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
