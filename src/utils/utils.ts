import fs from 'fs';
import path from 'path';
import mri from 'mri';

export function getConfig(): DSLint.Configuration {
  const argv = process.argv.slice(2);
  const args = mri(argv);
  return {
    fileKey: args._.join(''),
    teamId: args.teamId,
  };
}

/**
 * Returns the path to the core rules
 */
export function getCoreRulesPath() {
  return path.resolve(__dirname, '..', 'rules');
}

/**
 * Returns a list of Rules in the given directories
 */
export function getAllRules(
  rulesPaths: string[],
  config: DSLint.Configuration,
  options: DSLint.RuleLoaderOptions
): DSLint.Rules.RuleClass[] {
  return rulesPaths.reduce((acc, next) => {
    const st = fs.statSync(next);
    if (st.isDirectory) {
      const dirFiles = fs.readdirSync(next);
      dirFiles.forEach(async file => {
        const f = path.resolve(next, file);
        const rule = require(f).Rule;
        acc.push(rule);
      });
    }
    return acc;
  }, []);
}
