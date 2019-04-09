import fs from 'fs';
import path from 'path';

/**
 * Returns the path to the core rules
 */
export function getCoreRulesPath() {
  return path.resolve(__dirname, '..', 'rules');
}

export function getAllRules(
  rulesPaths: string[]
): DSLint.Rules.NameAndConstructor[] {
  const rules: DSLint.Rules.NameAndConstructor[] = [];
  rulesPaths.forEach(p => {
    const st = fs.statSync(p);

    if (st.isDirectory) {
      const rulesFiles = fs.readdirSync(p);
      rulesFiles.forEach(file => {
        const f = path.resolve(p, file);
        const rule = (require(f) as {Rule: DSLint.Rules.Constructor}).Rule;
        rules.push([path.parse(file).name, rule]);
      });
    }
  });

  return rules;
}
