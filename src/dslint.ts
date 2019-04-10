import {getAllRules} from './utils';
import {Client, getLocalStyles} from './toolkits/figma';
import {DocumentWalker} from './base/walker';

function lint(
  options: DSLint.LintOptions,
  config: DSLint.Configuration
): DSLint.Rules.Failure[] {
  const {file, rules, localStyles} = options;
  const rulesToApply = options.rules.map(
    ([ruleName, ctor]) => new ctor({ruleName})
  );

  const walker = new DocumentWalker(
    file.document,
    {
      rules: rulesToApply,
      file,
      localStyles,
    },
    config
  );
  walker.walk(file.document);
  return walker.getAllFailures();
}

export async function dslint(
  fileKey: string,
  personalAccessToken: string,
  // A list of paths to load rules from
  rulesPaths: string[],
  // Configurable options
  config: DSLint.Configuration
): Promise<DSLint.Rules.Failure[]> {
  try {
    const rules = getAllRules(rulesPaths);
    const client = new Client({personalAccessToken});
    const file = (await client.file(fileKey)).body;
    const localStyles = await getLocalStyles(file, client);
    return lint({client, file, localStyles, rules}, config);
  } catch (err) {
    console.trace(err);
  }
  return [];
}
